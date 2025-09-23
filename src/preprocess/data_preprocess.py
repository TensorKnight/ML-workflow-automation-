import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, MaxAbsScaler, QuantileTransformer
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from sklearn.neighbors import LocalOutlierFactor
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder
from sklearn.decomposition import PCA
from imblearn.over_sampling import SMOTE, ADASYN, BorderlineSMOTE
from imblearn.under_sampling import RandomUnderSampler, TomekLinks
from imblearn.combine import SMOTEENN, SMOTETomek
from scipy import stats
from scipy.stats import boxcox, yeojohnson
import warnings
import shutil
warnings.filterwarnings('ignore')

def get_line(title="", char="=", width=None):
    if width is None:
        width = shutil.get_terminal_size().columns
    if title:
        return f"{title.center(width, char)}"
    else:
        return char * width

class MissingValueHandler:
    def __init__(self, strategy_config):
        self.strategy_config = strategy_config
        self.imputers = {}
        
    def fit_transform(self, X, y=None, problem_type=None):
        X_imputed = X.copy()
        
        if 'drop_high_missing' in self.strategy_config:
            threshold = self.strategy_config['drop_high_missing'].get('threshold', 0.5)
            missing_ratio = X_imputed.isnull().sum() / len(X_imputed)
            cols_to_drop = missing_ratio[missing_ratio > threshold].index
            X_imputed = X_imputed.drop(columns=cols_to_drop)
        
        if 'constant' in self.strategy_config:
            for col in self.strategy_config['constant']:
                fill_val = self.strategy_config.get('fill_value', 0)
                X_imputed[col] = X_imputed[col].fillna(fill_val)
        
        if 'mean' in self.strategy_config:
            for col in self.strategy_config['mean']:
                if col in X_imputed.columns:
                    imputer = SimpleImputer(strategy='mean')
                    X_imputed[col] = imputer.fit_transform(X_imputed[[col]]).ravel()
                    self.imputers[f'{col}_mean'] = imputer
        
        if 'median' in self.strategy_config:
            for col in self.strategy_config['median']:
                if col in X_imputed.columns:
                    imputer = SimpleImputer(strategy='median')
                    X_imputed[col] = imputer.fit_transform(X_imputed[[col]]).ravel()
                    self.imputers[f'{col}_median'] = imputer
        
        if 'mode' in self.strategy_config:
            for col in self.strategy_config['mode']:
                if col in X_imputed.columns:
                    imputer = SimpleImputer(strategy='most_frequent')
                    X_imputed[col] = imputer.fit_transform(X_imputed[[col]]).ravel()
                    self.imputers[f'{col}_mode'] = imputer
        
        if 'knn' in self.strategy_config:
            numeric_cols = self.strategy_config['knn']
            if numeric_cols:
                n_neighbors = self.strategy_config.get('n_neighbors', 5)
                knn_imputer = KNNImputer(n_neighbors=n_neighbors)
                X_imputed[numeric_cols] = knn_imputer.fit_transform(X_imputed[numeric_cols])
                self.imputers['knn'] = knn_imputer
        
        if 'iterative' in self.strategy_config:
            numeric_cols = self.strategy_config['iterative']
            if numeric_cols:
                iter_imputer = IterativeImputer(random_state=42)
                X_imputed[numeric_cols] = iter_imputer.fit_transform(X_imputed[numeric_cols])
                self.imputers['iterative'] = iter_imputer
        
        if 'forward_fill' in self.strategy_config:
            for col in self.strategy_config['forward_fill']:
                X_imputed[col] = X_imputed[col].fillna(method='ffill')
        
        if 'backward_fill' in self.strategy_config:
            for col in self.strategy_config['backward_fill']:
                X_imputed[col] = X_imputed[col].fillna(method='bfill')
        
        if 'interpolate' in self.strategy_config:
            for col in self.strategy_config['interpolate']:
                method = self.strategy_config['interpolate'].get('method', 'linear')
                X_imputed[col] = X_imputed[col].interpolate(method=method)
        
        return X_imputed

class OutlierHandler:
    def __init__(self, method, threshold=3, action='cap', columns=None, percentile_low=0.05, percentile_high=0.95):
        self.method = method
        self.threshold = threshold
        self.action = action
        self.columns = columns
        self.percentile_low = percentile_low
        self.percentile_high = percentile_high
        self.stats_dict = {}
    
    def detect_outliers_zscore(self, X):
        z_scores = np.abs(stats.zscore(X))
        return z_scores > self.threshold
    
    def detect_outliers_modified_zscore(self, X):
        median = np.median(X)
        mad = np.median(np.abs(X - median))
        modified_z_scores = 0.6745 * (X - median) / mad
        return np.abs(modified_z_scores) > self.threshold
    
    def detect_outliers_iqr(self, X):
        Q1 = np.percentile(X, 25)
        Q3 = np.percentile(X, 75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        return (X < lower_bound) | (X > upper_bound)
    
    def detect_outliers_isolation_forest(self, X):
        iso_forest = IsolationForest(contamination=0.1, random_state=42)
        outliers = iso_forest.fit_predict(X)
        return outliers == -1
    
    def detect_outliers_lof(self, X):
        lof = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
        outliers = lof.fit_predict(X)
        return outliers == -1
    
    def fit_transform(self, X):
        X_processed = X.copy()
        
        if self.columns is None:
            numeric_cols = X.select_dtypes(include=[np.number]).columns
        else:
            numeric_cols = [col for col in self.columns if col in X.columns]
        
        for col in numeric_cols:
            if self.method == 'zscore':
                outliers = self.detect_outliers_zscore(X[col])
            elif self.method == 'modified_zscore':
                outliers = self.detect_outliers_modified_zscore(X[col])
            elif self.method == 'iqr':
                outliers = self.detect_outliers_iqr(X[col])
            elif self.method == 'isolation_forest':
                outliers = self.detect_outliers_isolation_forest(X[[col]])
            elif self.method == 'lof':
                outliers = self.detect_outliers_lof(X[[col]])
            else:
                continue
            
            if self.action == 'remove':
                X_processed = X_processed[~outliers]
            elif self.action == 'cap':
                lower_cap = np.percentile(X[col], self.percentile_low * 100)
                upper_cap = np.percentile(X[col], self.percentile_high * 100)
                X_processed[col] = np.clip(X_processed[col], lower_cap, upper_cap)
                self.stats_dict[col] = {'lower_cap': lower_cap, 'upper_cap': upper_cap}
            elif self.action == 'transform_log':
                X_processed[col] = np.log1p(X_processed[col])
        
        return X_processed

class CategoricalEncoder:
    def __init__(self, encoding_config):
        self.encoding_config = encoding_config
        self.encoders = {}
    
    def fit_transform(self, X, y=None):
        X_encoded = X.copy()
        
        if 'onehot' in self.encoding_config:
            for col in self.encoding_config['onehot']:
                if col in X_encoded.columns:
                    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
                    encoded_cols = encoder.fit_transform(X_encoded[[col]])
                    feature_names = [f"{col}_{cat}" for cat in encoder.categories_[0]]
                    encoded_df = pd.DataFrame(encoded_cols, columns=feature_names, index=X_encoded.index)
                    X_encoded = X_encoded.drop(columns=[col])
                    X_encoded = pd.concat([X_encoded, encoded_df], axis=1)
                    self.encoders[f'{col}_onehot'] = encoder
        
        if 'ordinal' in self.encoding_config:
            for col in self.encoding_config['ordinal']:
                if col in X_encoded.columns:
                    encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
                    X_encoded[col] = encoder.fit_transform(X_encoded[[col]]).ravel()
                    self.encoders[f'{col}_ordinal'] = encoder
        
        if 'frequency' in self.encoding_config:
            for col in self.encoding_config['frequency']:
                if col in X_encoded.columns:
                    freq_map = X_encoded[col].value_counts().to_dict()
                    X_encoded[col] = X_encoded[col].map(freq_map)
                    self.encoders[f'{col}_frequency'] = freq_map
        
        if 'target' in self.encoding_config and y is not None:
            for col in self.encoding_config['target']:
                if col in X_encoded.columns:
                    target_map = X_encoded.groupby(col)[y.name].mean().to_dict()
                    X_encoded[col] = X_encoded[col].map(target_map)
                    self.encoders[f'{col}_target'] = target_map
        
        if 'binary' in self.encoding_config:
            for col in self.encoding_config['binary']:
                if col in X_encoded.columns:
                    unique_vals = X_encoded[col].unique()
                    n_bits = int(np.ceil(np.log2(len(unique_vals))))
                    for i in range(n_bits):
                        X_encoded[f"{col}_bit_{i}"] = X_encoded[col].apply(
                            lambda x: (hash(str(x)) >> i) & 1
                        )
                    X_encoded = X_encoded.drop(columns=[col])
        
        return X_encoded

class RareCategoryHandler:
    def __init__(self, columns=None, threshold=0.01, replacement='Other'):
        self.columns = columns
        self.threshold = threshold
        self.replacement = replacement
        self.rare_maps = {}
    
    def fit_transform(self, X):
        X_processed = X.copy()
        
        if self.columns is None:
            categorical_cols = X.select_dtypes(include=['object', 'category']).columns
        else:
            categorical_cols = [col for col in self.columns if col in X.columns]
        
        for col in categorical_cols:
            value_counts = X[col].value_counts(normalize=True)
            rare_categories = value_counts[value_counts < self.threshold].index.tolist()
            self.rare_maps[col] = rare_categories
            X_processed[col] = X_processed[col].replace(rare_categories, self.replacement)
        
        return X_processed

class FeatureScaler:
    def __init__(self, scaling_config):
        self.scaling_config = scaling_config
        self.scalers = {}
    
    def fit_transform(self, X):
        X_scaled = X.copy()
        
        if 'standard' in self.scaling_config:
            for col in self.scaling_config['standard']:
                if col in X_scaled.columns:
                    scaler = StandardScaler()
                    X_scaled[col] = scaler.fit_transform(X_scaled[[col]]).ravel()
                    self.scalers[f'{col}_standard'] = scaler
        
        if 'minmax' in self.scaling_config:
            for col in self.scaling_config['minmax']:
                if col in X_scaled.columns:
                    scaler = MinMaxScaler()
                    X_scaled[col] = scaler.fit_transform(X_scaled[[col]]).ravel()
                    self.scalers[f'{col}_minmax'] = scaler
        
        if 'robust' in self.scaling_config:
            for col in self.scaling_config['robust']:
                if col in X_scaled.columns:
                    scaler = RobustScaler()
                    X_scaled[col] = scaler.fit_transform(X_scaled[[col]]).ravel()
                    self.scalers[f'{col}_robust'] = scaler
        
        if 'maxabs' in self.scaling_config:
            for col in self.scaling_config['maxabs']:
                if col in X_scaled.columns:
                    scaler = MaxAbsScaler()
                    X_scaled[col] = scaler.fit_transform(X_scaled[[col]]).ravel()
                    self.scalers[f'{col}_maxabs'] = scaler
        
        if 'quantile' in self.scaling_config:
            for col in self.scaling_config['quantile']:
                if col in X_scaled.columns:
                    scaler = QuantileTransformer(output_distribution='normal')
                    X_scaled[col] = scaler.fit_transform(X_scaled[[col]]).ravel()
                    self.scalers[f'{col}_quantile'] = scaler
        
        return X_scaled

class SkewnessHandler:
    def __init__(self, method='log', columns=None, threshold=0.5):
        self.method = method
        self.columns = columns
        self.threshold = threshold
        self.transform_params = {}
    
    def fit_transform(self, X):
        X_transformed = X.copy()
        
        if self.columns is None:
            numeric_cols = X.select_dtypes(include=[np.number]).columns
        else:
            numeric_cols = [col for col in self.columns if col in X.columns]
        
        for col in numeric_cols:
            skewness = stats.skew(X[col].dropna())
            
            if abs(skewness) > self.threshold:
                if self.method == 'log':
                    if (X[col] > 0).all():
                        X_transformed[col] = np.log(X[col])
                    else:
                        X_transformed[col] = np.log1p(X[col] - X[col].min() + 1)
                
                elif self.method == 'boxcox':
                    if (X[col] > 0).all():
                        transformed, lambda_param = boxcox(X[col])
                        X_transformed[col] = transformed
                        self.transform_params[col] = {'method': 'boxcox', 'lambda': lambda_param}
                
                elif self.method == 'yeo_johnson':
                    transformed, lambda_param = yeojohnson(X[col])
                    X_transformed[col] = transformed
                    self.transform_params[col] = {'method': 'yeo_johnson', 'lambda': lambda_param}
                
                elif self.method == 'sqrt':
                    if (X[col] >= 0).all():
                        X_transformed[col] = np.sqrt(X[col])
                
                elif self.method == 'reciprocal':
                    X_transformed[col] = 1 / (X[col] + 1)
        
        return X_transformed

class ClassImbalanceHandler:
    def __init__(self, method='smote', k_neighbors=5, sampling_strategy='auto'):
        self.method = method
        self.k_neighbors = k_neighbors
        self.sampling_strategy = sampling_strategy
        self.sampler = None
    
    def fit_resample(self, X, y):
        if self.method == 'smote':
            self.sampler = SMOTE(k_neighbors=self.k_neighbors, random_state=42)
        elif self.method == 'adasyn':
            self.sampler = ADASYN(n_neighbors=self.k_neighbors, random_state=42)
        elif self.method == 'borderline_smote':
            self.sampler = BorderlineSMOTE(k_neighbors=self.k_neighbors, random_state=42)
        elif self.method == 'random_oversample':
            from imblearn.over_sampling import RandomOverSampler
            self.sampler = RandomOverSampler(random_state=42)
        elif self.method == 'random_undersample':
            self.sampler = RandomUnderSampler(random_state=42)
        elif self.method == 'smote_tomek':
            self.sampler = SMOTETomek(random_state=42)
        elif self.method == 'smote_enn':
            self.sampler = SMOTEENN(random_state=42)
        
        if self.sampler:
            X_resampled, y_resampled = self.sampler.fit_resample(X, y)
            return X_resampled, y_resampled
        
        return X, y

from tabulate import tabulate
import time

class DataPreprocessor:
    def __init__(self, df, config=None, problem_type='regression', auto_clean=False):
        self.df = df.copy()
        self.config = config
        self.problem_type = problem_type
        self.auto_clean = auto_clean
        self.preprocessing_report = {}
        
        self.missing_handler = None
        self.outlier_handler = None
        self.encoder = None
        self.rare_handler = None
        self.scaler = None
        self.skewness_handler = None
        self.imbalance_handler = None
    
    def auto_preprocessing(self):
        try:
            from datacleaner import autoclean
            self.df_processed = autoclean(self.df)
            self.preprocessing_report['auto_clean'] = 'Applied autoclean from datacleaner module'
            return self.df_processed
        except ImportError:
            print("datacleaner module not found. Please install it using: pip install datacleaner")
            return self.df
    
    def preprocess(self, target_column=None):
        start_time = time.time()
        
        if self.auto_clean:
            self.df_processed = self.auto_preprocessing()
            runtime = time.time() - start_time
            return self.df_processed, runtime
        
        if self.config is None:
            raise ValueError("Config must be provided for manual preprocessing")
        
        self.df_processed = self.df.copy()
        original_shape = self.df_processed.shape
        
        target_data = None
        if target_column and target_column in self.df_processed.columns:
            target_data = self.df_processed[target_column]
        
        if 'imputation' in self.config:
            self.missing_handler = MissingValueHandler(self.config['imputation'])
            self.df_processed = self.missing_handler.fit_transform(self.df_processed, target_data, self.problem_type)
        
        if 'outlier' in self.config:
            outlier_config = self.config['outlier']
            self.outlier_handler = OutlierHandler(
                method=outlier_config.get('method', 'zscore'),
                threshold=outlier_config.get('threshold', 3),
                action=outlier_config.get('action', 'cap'),
                columns=outlier_config.get('columns'),
                percentile_low=outlier_config.get('percentile_low', 0.05),
                percentile_high=outlier_config.get('percentile_high', 0.95)
            )
            self.df_processed = self.outlier_handler.fit_transform(self.df_processed)
        
        if 'rare_category' in self.config:
            rare_config = self.config['rare_category']
            self.rare_handler = RareCategoryHandler(
                columns=rare_config.get('columns'),
                threshold=rare_config.get('threshold', 0.01),
                replacement=rare_config.get('replacement', 'Other')
            )
            self.df_processed = self.rare_handler.fit_transform(self.df_processed)
        
        if 'skewness' in self.config:
            skew_config = self.config['skewness']
            self.skewness_handler = SkewnessHandler(
                method=skew_config.get('method', 'log'),
                columns=skew_config.get('columns'),
                threshold=skew_config.get('threshold', 0.5)
            )
            self.df_processed = self.skewness_handler.fit_transform(self.df_processed)
        
        if 'encoding' in self.config:
            self.encoder = CategoricalEncoder(self.config['encoding'])
            self.df_processed = self.encoder.fit_transform(self.df_processed, target_data)
        
        if 'scaling' in self.config:
            self.scaler = FeatureScaler(self.config['scaling'])
            self.df_processed = self.scaler.fit_transform(self.df_processed)
        
        if 'class_imbalance' in self.config and target_column and self.problem_type == 'classification':
            imbalance_config = self.config['class_imbalance']
            self.imbalance_handler = ClassImbalanceHandler(
                method=imbalance_config.get('method', 'smote'),
                k_neighbors=imbalance_config.get('k_neighbors', 5)
            )
            features = self.df_processed.drop(columns=[target_column])
            target = self.df_processed[target_column]
            resampled_features, resampled_target = self.imbalance_handler.fit_resample(features, target)
            self.df_processed = pd.concat([resampled_features, resampled_target], axis=1)
        
        runtime = time.time() - start_time
        self._print_dataset_info(runtime, original_shape)
        return self.df_processed, runtime
    
    def _print_dataset_info(self, runtime, original_shape):
        print("🔄 Loading data...")
        print(f"✅ Successfully loaded {original_shape[0]} rows and {original_shape[1]} columns")
        print("✅ Data Preprocessing completed successfully!\n")
    
        print(get_line(" Data Preprocess Information ","="))
        print("\n")
        from datetime import datetime
        print(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Total Rows: {self.df_processed.shape[0]:,}")
        print(f"Total Columns: {self.df_processed.shape[1]:,}")
        print(f"Runtime: {runtime/60:.0f} min {runtime%60:.2f} sec\n")
        
        before_table = [["BEFORE PROCESSING", "INFO"]]
        before_table.append(["Shape", original_shape])
        before_table.append(["Missing Values", self.df.isnull().sum().sum()])
        before_table.append(["Duplicate Rows", self.df.duplicated().sum()])
        before_table.append(["Numerical Columns", list(self.df.select_dtypes(include=[np.number]).columns)])
        before_table.append(["Categorical Columns", list(self.df.select_dtypes(include=['object', 'category']).columns)])
        before_table.append(["Constant/Quasi-Constant Columns", [col for col in self.df.columns if self.df[col].nunique() <= 1]])
        before_table.append(["Outlier Columns", [col for col in self.df.select_dtypes(include=[np.number]).columns if ((self.df[col] > (self.df[col].mean() + 3*self.df[col].std())) | (self.df[col] < (self.df[col].mean() - 3*self.df[col].std()))).any()]])
        before_table.append(["Highly Correlated Columns", [(col1, col2) for col1 in self.df.corr().columns for col2 in self.df.corr().columns if col1 != col2 and abs(self.df.corr().loc[col1, col2]) > 0.9]])
        
        after_table = [["AFTER PROCESSING", "INFO"]]
        after_table.append(["Shape", self.df_processed.shape])
        after_table.append(["Missing Values", self.df_processed.isnull().sum().sum()])
        after_table.append(["Duplicate Rows", self.df_processed.duplicated().sum()])
        after_table.append(["Numerical Columns", list(self.df_processed.select_dtypes(include=[np.number]).columns)])
        after_table.append(["Categorical Columns", list(self.df_processed.select_dtypes(include=['object', 'category']).columns)])
        after_table.append(["Constant/Quasi-Constant Columns", [col for col in self.df_processed.columns if self.df_processed[col].nunique() <= 1]])
        after_table.append(["Outlier Columns", [col for col in self.df_processed.select_dtypes(include=[np.number]).columns if ((self.df_processed[col] > (self.df_processed[col].mean() + 3*self.df_processed[col].std())) | (self.df_processed[col] < (self.df_processed[col].mean() - 3*self.df_processed[col].std()))).any()]])
        after_table.append(["Highly Correlated Columns", [(col1, col2) for col1 in self.df_processed.corr().columns for col2 in self.df_processed.corr().columns if col1 != col2 and abs(self.df_processed.corr().loc[col1, col2]) > 0.9]])
        
        print(get_line(" Pre-Process Information ","-"))
        print("\n")
        print(tabulate(before_table, headers="firstrow", tablefmt="fancy_grid"))
        print("\n\n")
        print(get_line(" Post-Process Information ","-"))
        print("\n")
        print(tabulate(after_table, headers="firstrow", tablefmt="fancy_grid"))
        print("\n\n")
        print(get_line(" Processed Data ","-"))
        print("\n")
        print(f"{self.df_processed.head(5)}")
        print(f"Runtime: {runtime:.4f} seconds")
    
    def get_processed_data(self):
        return self.df_processed




if __name__ == "__main__":
    import pandas as pd

    # Load the dataset
    df = pd.read_csv("../../datasets/heart.csv")

    # Define the configuration for preprocessing
    config_heart = {
        "imputation": {
            "mean": ["age", "trestbps", "chol", "thalach", "oldpeak"],
            "mode": ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"],
            "knn": [],
            "n_neighbors": 3,
            "fill_value": 0
        },
        "encoding": {
            "onehot": ["cp", "restecg", "slope", "thal"],
            "frequency": ["ca"],
            "ordinal": [],
            "target": [],
            "binary": ["sex", "fbs", "exang"]
        },
        "scaling": {
            "standard": ["age", "trestbps", "chol", "thalach", "oldpeak"],
            "minmax": [],
            "robust": [],
            "maxabs": [],
            "quantile": []
        },
        "outlier": {
            "method": "zscore",
            "threshold": 3,
            "action": "cap",
            "columns": ["age", "trestbps", "chol", "thalach", "oldpeak"],
            "percentile_low": 0.05,
            "percentile_high": 0.95
        },
        "rare_category": {
            "columns": ["ca"],
            "threshold": 0.1,
            "replacement": "Other"
        },
        "skewness": {
            "method": "log",
            "columns": ["chol", "oldpeak"],
            "threshold": 0.5
        },
        "class_imbalance": {
            "method": "smote",
            "k_neighbors": 3
        }
    }

    # Initialize the preprocessor
    preprocessor = DataPreprocessor(df, config_heart, problem_type="classification")

    # Run preprocessing and get runtime
    processed_data, runtime = preprocessor.preprocess(target_column="target")
