import pandas as pd
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif, f_regression, RFE
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import PolynomialFeatures
from sklearn.decomposition import PCA
from itertools import combinations
import warnings
from scipy import stats
import shutil
warnings.filterwarnings('ignore')

def print_line(title="", char="="):
    width = shutil.get_terminal_size().columns
    if title:
        print(f"\n{title.center(width, char)}")
    else:
        print(char * width)


class AutoFeatureGenerator:
    def __init__(self, target_type='classification'):
        self.target_type = target_type
        self.polynomial_features = None
        self.interaction_features = []
    
    def generate_polynomial_features(self, df, degree=2, include_bias=False):
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) > 10:
            numeric_cols = numeric_cols[:10]
        
        if len(numeric_cols) > 0:
            poly = PolynomialFeatures(degree=degree, include_bias=include_bias)
            poly_features = poly.fit_transform(df[numeric_cols])
            feature_names = poly.get_feature_names_out(numeric_cols)
            
            poly_df = pd.DataFrame(poly_features, columns=feature_names, index=df.index)
            original_cols = [col for col in feature_names if col in numeric_cols]
            new_cols = [col for col in feature_names if col not in numeric_cols]
            
            self.polynomial_features = poly
            return poly_df[new_cols]
        return pd.DataFrame()
    
    def generate_interaction_features(self, df, max_interactions=20):
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) > 10:
            numeric_cols = numeric_cols[:10]
        
        interaction_df = pd.DataFrame(index=df.index)
        count = 0
        
        for col1, col2 in combinations(numeric_cols, 2):
            if count >= max_interactions:
                break
            
            interaction_df[f'{col1}_x_{col2}'] = df[col1] * df[col2]
            interaction_df[f'{col1}_div_{col2}'] = np.where(df[col2] != 0, df[col1] / df[col2], 0)
            interaction_df[f'{col1}_add_{col2}'] = df[col1] + df[col2]
            interaction_df[f'{col1}_sub_{col2}'] = df[col1] - df[col2]
            
            self.interaction_features.extend([f'{col1}_x_{col2}', f'{col1}_div_{col2}', 
                                           f'{col1}_add_{col2}', f'{col1}_sub_{col2}'])
            count += 4
        
        return interaction_df
    
    def generate_statistical_features(self, df):
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        stat_df = pd.DataFrame(index=df.index)
        
        if len(numeric_cols) >= 2:
            stat_df['mean_all'] = df[numeric_cols].mean(axis=1)
            stat_df['std_all'] = df[numeric_cols].std(axis=1)
            stat_df['max_all'] = df[numeric_cols].max(axis=1)
            stat_df['min_all'] = df[numeric_cols].min(axis=1)
            stat_df['range_all'] = stat_df['max_all'] - stat_df['min_all']
        
        return stat_df
    
    def generate_log_features(self, df):
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        log_df = pd.DataFrame(index=df.index)
        
        for col in numeric_cols:
            if df[col].min() > 0:
                log_df[f'log_{col}'] = np.log(df[col])
                log_df[f'sqrt_{col}'] = np.sqrt(df[col])
        
        return log_df
    
    def generate_all_features(self, df):
        all_features = []
        
        poly_features = self.generate_polynomial_features(df)
        if not poly_features.empty:
            all_features.append(poly_features)
        
        interaction_features = self.generate_interaction_features(df)
        if not interaction_features.empty:
            all_features.append(interaction_features)
        
        stat_features = self.generate_statistical_features(df)
        if not stat_features.empty:
            all_features.append(stat_features)
        
        log_features = self.generate_log_features(df)
        if not log_features.empty:
            all_features.append(log_features)
        
        if all_features:
            return pd.concat(all_features, axis=1)
        return pd.DataFrame()


class ManualFeatureGenerator:
    def __init__(self, config):
        self.config = config
        self.created_features = []
    
    def create_features(self, df):
        result_df = df.copy()
        
        if "manual_features" in self.config:
            for feature_name, expression in self.config["manual_features"].items():
                try:
                    result_df[feature_name] = result_df.eval(expression)
                    self.created_features.append(feature_name)
                except Exception as e:
                    print(f"Error creating feature {feature_name}: {e}")
        
        return result_df


class FeatureTransformer:
    def __init__(self):
        self.transformations = {}
    
    def apply_transformations(self, df):
        result_df = df.copy()
        numeric_cols = result_df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_cols:
            if result_df[col].skew() > 1:
                if result_df[col].min() > 0:
                    result_df[f'{col}_log'] = np.log(result_df[col])
                    self.transformations[f'{col}_log'] = 'log'
            
            if result_df[col].var() > 1000:
                result_df[f'{col}_scaled'] = (result_df[col] - result_df[col].mean()) / result_df[col].std()
                self.transformations[f'{col}_scaled'] = 'scaled'
        
        return result_df


class FeatureSelector:
    def __init__(self, selection_method='univariate', k_features=20, target_type='classification'):
        self.selection_method = selection_method
        self.k_features = k_features
        self.target_type = target_type
        self.selector = None
        self.selected_features = []
    
    def select_features(self, df, target_col):
        if target_col not in df.columns:
            return df
        
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        if self.selection_method == 'univariate':
            if self.target_type == 'classification':
                self.selector = SelectKBest(score_func=f_classif, k=min(self.k_features, X.shape[1]))
            else:
                self.selector = SelectKBest(score_func=f_regression, k=min(self.k_features, X.shape[1]))
            
            X_selected = self.selector.fit_transform(X, y)
            selected_idx = self.selector.get_support()
            self.selected_features = X.columns[selected_idx].tolist()
        
        elif self.selection_method == 'rfe':
            if self.target_type == 'classification':
                estimator = RandomForestClassifier(n_estimators=100, random_state=42)
            else:
                estimator = RandomForestRegressor(n_estimators=100, random_state=42)
            
            self.selector = RFE(estimator, n_features_to_select=min(self.k_features, X.shape[1]))
            X_selected = self.selector.fit_transform(X, y)
            selected_idx = self.selector.get_support()
            self.selected_features = X.columns[selected_idx].tolist()
        
        elif self.selection_method == 'variance':
            variances = X.var()
            high_variance_cols = variances.nlargest(min(self.k_features, len(variances))).index.tolist()
            self.selected_features = high_variance_cols
        
        result_df = df[self.selected_features + [target_col]]
        return result_df


class DimensionalityReducer:
    def __init__(self, method='pca', n_components=10):
        self.method = method
        self.n_components = n_components
        self.reducer = None
    
    def reduce_dimensions(self, df, target_col=None):
        if target_col and target_col in df.columns:
            X = df.drop(columns=[target_col])
            y = df[target_col]
        else:
            X = df
            y = None
        
        if X.shape[1] <= self.n_components:
            return df
        
        if self.method == 'pca':
            self.reducer = PCA(n_components=self.n_components)
            X_reduced = self.reducer.fit_transform(X)
            
            feature_names = [f'PC{i+1}' for i in range(self.n_components)]
            reduced_df = pd.DataFrame(X_reduced, columns=feature_names, index=df.index)
            
            if y is not None:
                reduced_df[target_col] = y
        
        return reduced_df



class FeatureEngineeringTest:
    def __init__(self, df, original_df=None, feature_pipeline=None):
        self.df = df
        self.original_df = original_df
        self.pipeline = feature_pipeline

    def print_data_shapes(self):
        print_line("Data Shapes", "-")
        print(f"\nOriginal data shape: {self.original_df.shape if self.original_df is not None else 'N/A'}")
        print(f"Feature engineered data shape: {self.df.shape}\n")

    def feature_counts(self):
        print_line("Feature Counts", "-")
        if self.pipeline:
            print(f"Original features: {len(self.pipeline.original_features)} -> {self.pipeline.original_features}")
            print(f"Auto-generated features: {len(self.pipeline.auto_features)} -> {self.pipeline.auto_features[:10]} ...")
            print(f"Manual features: {len(self.pipeline.manual_features)} -> {self.pipeline.manual_features}")
            print(f"Final selected features: {len(self.pipeline.final_features)} -> {self.pipeline.final_features}\n")

    def feature_types_test(self):
        print_line("Feature Types", "-")
        print("\n")
        numeric_cols = self.df.select_dtypes(include=np.number).columns.tolist()
        categorical_cols = self.df.select_dtypes(include=['object','category']).columns.tolist()
        print(f"Numeric features ({len(numeric_cols)}): {numeric_cols}")
        print(f"Categorical features ({len(categorical_cols)}): {categorical_cols}\n")

    def numeric_ranges_test(self):
        print_line("Numeric Feature Ranges", "-")
        print("\n")
        numeric_cols = self.df.select_dtypes(include=np.number).columns
        desc = self.df[numeric_cols].describe().T
        print(desc[['min','max','mean','std']])

    def feature_correlations(self, top_n=10):
        print_line("Feature Correlations with Target", "-")
        if self.pipeline and self.pipeline.target_col in self.df.columns:
            corr = self.df.corr()[self.pipeline.target_col].drop(self.pipeline.target_col).abs().sort_values(ascending=False)
            print(f"Top {top_n} features correlated with target:\n{corr.head(top_n)}\n")
        else:
            print("Target column not available.\n")

    def outlier_test(self, z_threshold=3):
        print_line("Outlier Test (Z-Score > 3)", "-")
        numeric_cols = self.df.select_dtypes(include=np.number).columns
        z = np.abs(stats.zscore(self.df[numeric_cols]))
        outliers = (z > z_threshold).sum()
        print(f"Number of outlier values per numeric feature:\n{outliers}\n")

    def run_all_tests(self):
        print_line("Feature Engineering Report")
        print("\n\n")
        self.print_data_shapes()
        self.feature_counts()
        self.feature_types_test()
        self.numeric_ranges_test()
        self.feature_correlations()
        self.outlier_test()
        print("\n\n\n\n")

class FeatureEngineer:
    def __init__(self, feature_type='both', manual_config=None, target_type='classification', 
                 target_col=None, selection_method='univariate', k_features=20, 
                 apply_dimensionality_reduction=False, n_components=10):
        self.feature_type = feature_type
        self.manual_config = manual_config or {}
        self.target_type = target_type
        self.target_col = target_col
        self.selection_method = selection_method
        self.k_features = k_features
        self.apply_dimensionality_reduction = apply_dimensionality_reduction
        self.n_components = n_components

        self.auto_generator = AutoFeatureGenerator(target_type)
        self.manual_generator = ManualFeatureGenerator(self.manual_config)
        self.transformer = FeatureTransformer()
        self.selector = FeatureSelector(selection_method, k_features, target_type)
        self.reducer = DimensionalityReducer('pca', n_components)

        self.original_features = []
        self.auto_features = []
        self.manual_features = []
        self.final_features = []

        self.tester = None

    def run_pipeline(self, df):
        self.original_features = df.columns.tolist()
        result_df = df.copy()

        if self.feature_type in ['auto', 'both']:
            auto_features_df = self.auto_generator.generate_all_features(result_df)
            if not auto_features_df.empty:
                result_df = pd.concat([result_df, auto_features_df], axis=1)
                self.auto_features = auto_features_df.columns.tolist()

        if self.feature_type in ['manual', 'both'] and self.manual_config.get("manual_features", {}):
            result_df = self.manual_generator.create_features(result_df)
            self.manual_features = self.manual_generator.created_features

        result_df = self.transformer.apply_transformations(result_df)
        result_df = result_df.fillna(0)
        result_df = result_df.replace([np.inf, -np.inf], 0)

        if self.target_col:
            result_df = self.selector.select_features(result_df, self.target_col)
            self.final_features = self.selector.selected_features
            if self.apply_dimensionality_reduction:
                result_df = self.reducer.reduce_dimensions(result_df, self.target_col)

        self.tester = FeatureEngineeringTest(df=result_df, original_df=df, feature_pipeline=self)
        self.tester.run_all_tests()

        return result_df

    def get_feature_info(self):
        return {
            'original_features': len(self.original_features),
            'auto_features': len(self.auto_features),
            'manual_features': len(self.manual_features),
            'final_features': len(self.final_features),
            'selected_features': self.final_features
        }



if __name__ == "__main__":
    sample_data = pd.read_csv("../../datasets/heart.csv")

    manual_config = {
        "manual_features": {
            "age_trestbps_ratio": "age / trestbps",         
            "chol_thalach_product": "chol * thalach",      
            "oldpeak_per_trestbps": "oldpeak / (trestbps + 1)", 
            "age_chol_sum": "age + chol"                     
        }
    }

    pipeline = FeatureEngineer(
        feature_type='both',      
        manual_config=manual_config,
        target_type='classification',
        target_col='target',
        selection_method='univariate',  
        k_features=15
    )


    engineered_data = pipeline.run_pipeline(sample_data)
    feature_info = pipeline.get_feature_info()
