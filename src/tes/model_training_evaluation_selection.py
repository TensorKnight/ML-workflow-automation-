import pandas as pd
import numpy as np
import warnings
import shutil
import time
from IPython.display import display, HTML
from sklearn.model_selection import train_test_split
from sklearn.metrics import (accuracy_score, roc_auc_score, precision_score, 
                           recall_score, f1_score, r2_score, mean_absolute_error,
                           mean_squared_error, mean_squared_log_error, 
                           mean_absolute_percentage_error)
from sklearn.ensemble import (RandomForestClassifier, ExtraTreesClassifier, 
                            GradientBoostingClassifier, AdaBoostClassifier,
                            RandomForestRegressor, ExtraTreesRegressor,
                            GradientBoostingRegressor, AdaBoostRegressor,
                            VotingClassifier, VotingRegressor)
from sklearn.linear_model import (LogisticRegression, LinearRegression, Ridge,
                                RidgeClassifier, Lasso, ElasticNet, LassoLars,
                                BayesianRidge, Lars, PassiveAggressiveRegressor,
                                OrthogonalMatchingPursuit, HuberRegressor)
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from lightgbm import LGBMClassifier, LGBMRegressor
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis


warnings.filterwarnings('ignore')

def print_line(title="", char="="):
    width = shutil.get_terminal_size().columns
    if title:
        print(f"\n{title.center(width, char)}")
    else:
        print(char * width)

class ModelRegistry:
    @staticmethod
    def get_regression_models():
        return {
            "CatBoost Regressor": CatBoostRegressor(verbose=0, train_dir='/tmp'),
            "XGBoost Regressor": XGBRegressor(verbosity=0),
            "LightGBM Regressor": LGBMRegressor(verbose=-1),
            "Gradient Boosting": GradientBoostingRegressor(),
            "Extra Trees": ExtraTreesRegressor(),
            "Random Forest": RandomForestRegressor(),
            "Decision Tree": DecisionTreeRegressor(),
            "AdaBoost": AdaBoostRegressor(),
            "KNN Regressor": KNeighborsRegressor(),
            "Orthogonal Matching Pursuit": OrthogonalMatchingPursuit(),
            "LassoLars": LassoLars(),
            "Elastic Net": ElasticNet(),
            "Lasso": Lasso(),
            "Huber Regressor": HuberRegressor(),
            "Linear Regression": LinearRegression(),
            "Ridge Regression": Ridge(),
            "Bayesian Ridge": BayesianRidge(),
            "LARS": Lars(),
            "Passive Aggressive": PassiveAggressiveRegressor()
        }
    
    @staticmethod
    def get_classification_models():
        return {
            "Light Gradient Boosting Machine": LGBMClassifier(verbose=-1),
            "Gradient Boosting Classifier": GradientBoostingClassifier(),
            "Random Forest Classifier": RandomForestClassifier(),
            "Extra Trees Classifier": ExtraTreesClassifier(),
            "Logistic Regression": LogisticRegression(max_iter=1000),
            "Naïve Bayes": GaussianNB(),
            "SVM – Linear Kernel": SVC(kernel='linear', probability=True),
            "Linear Discriminant Analysis": LinearDiscriminantAnalysis(),
            "Ridge Classifier": RidgeClassifier(),
            "Decision Tree Classifier": DecisionTreeClassifier(),
            "K Neighbors Classifier": KNeighborsClassifier(),
            "Quadratic Discriminant Analysis": QuadraticDiscriminantAnalysis(),
            "Ada Boost Classifier": AdaBoostClassifier()
        }

class MetricsCalculator:
    @staticmethod
    def calculate_classification_metrics(y_true, y_pred, y_pred_proba, training_time):
        metrics = {
            "Accuracy": accuracy_score(y_true, y_pred),
            "AUC": roc_auc_score(y_true, y_pred_proba[:, 1]) if y_pred_proba.shape[1] == 2 else 0,
            "Precision": precision_score(y_true, y_pred, average='weighted'),
            "Recall": recall_score(y_true, y_pred, average='weighted'),
            "F1": f1_score(y_true, y_pred, average='weighted'),
            "TT (Sec)": training_time
        }
        return metrics
    
    @staticmethod
    def calculate_regression_metrics(y_true, y_pred, training_time):
        try:
            rmsle = np.sqrt(mean_squared_log_error(y_true, y_pred))
        except ValueError:
            rmsle = np.nan
        
        try:
            mape = mean_absolute_percentage_error(y_true, y_pred)
        except ValueError:
            mape = np.nan
        
        metrics = {
            "R2": r2_score(y_true, y_pred),
            "MAE": mean_absolute_error(y_true, y_pred),
            "MSE": mean_squared_error(y_true, y_pred),
            "RMSE": np.sqrt(mean_squared_error(y_true, y_pred)),
            "RMSLE": rmsle,
            "MAPE": mape,
            "TT (Sec)": training_time
        }
        return metrics

class ModelTrainer:
    def __init__(self, problem_type, custom_models=None, custom_metrics=None):
        self.problem_type = problem_type.lower()
        self.models = self._get_models()
        
        if custom_models:
            self.models.update(custom_models)
        
        self.custom_metrics = custom_metrics
        
        self.results = []
        
    def _get_models(self):
        if self.problem_type == 'regression':
            return ModelRegistry.get_regression_models()
        elif self.problem_type == 'classification':
            return ModelRegistry.get_classification_models()
        else:
            raise ValueError("Problem type must be 'regression' or 'classification'")
    
    def train_all_models(self, X_train, X_test, y_train, y_test):
        for model_name, model in self.models.items():
            try:
                start_time = time.time()
                model.fit(X_train, y_train)
                training_time = time.time() - start_time
                
                y_pred = model.predict(X_test)
                
                if self.problem_type == 'classification':
                    try:
                        y_pred_proba = model.predict_proba(X_test)
                    except:
                        y_pred_proba = np.zeros((len(y_test), 2))
                    metrics = MetricsCalculator.calculate_classification_metrics(
                        y_test, y_pred, y_pred_proba, training_time
                    )
                else:
                    metrics = MetricsCalculator.calculate_regression_metrics(
                        y_test, y_pred, training_time
                    )
                

                if self.custom_metrics:
                    for metric_name, func in self.custom_metrics.items():
                        try:
                            metrics[metric_name] = func(y_test, y_pred)
                        except Exception as e:
                            metrics[metric_name] = None
                
                result = {"Model": model_name, **metrics}
                self.results.append(result)
                
            except Exception as e:
                print(f"Error training {model_name}: {str(e)}")
                continue
    
    def get_results_dataframe(self):
        return pd.DataFrame(self.results)


class ModelEvaluator:
    def __init__(self, problem_type):
        self.problem_type = problem_type.lower()
    
    def get_best_metric_column(self):
        if self.problem_type == 'classification':
            return 'Accuracy'
        else:
            return 'R2'
    
    def filter_results(self, df):
        metric_col = self.get_best_metric_column()
        filtered_df = df[df[metric_col] < 0.9999].copy()
        return filtered_df
    
    def display_results_table(self, df, title="Model Performance"):
        filtered_df = self.filter_results(df)
        metric_col = self.get_best_metric_column()
        
        best_idx = filtered_df[metric_col].idxmax()
        
        def highlight_best(row):
            if row.name == best_idx:
                return ['background-color: lightgreen'] * len(row)
            else:
                return [''] * len(row)
        
        styled_df = filtered_df.style.apply(highlight_best, axis=1)
        
        print_line(title)
        display(styled_df)
        
        return filtered_df


class ModelSelector:
    def __init__(self, problem_type):
        self.problem_type = problem_type.lower()
        self.evaluator = ModelEvaluator(problem_type)
    
    def select_best_model(self, results_df):
        filtered_df = self.evaluator.filter_results(results_df)
        metric_col = self.evaluator.get_best_metric_column()
        best_model_row = filtered_df.loc[filtered_df[metric_col].idxmax()]
        return [best_model_row["Model"]]   
    
    def select_top_k_models(self, results_df, k=3):
        filtered_df = self.evaluator.filter_results(results_df)
        metric_col = self.evaluator.get_best_metric_column()
        top_k = filtered_df.nlargest(k, metric_col)
        return top_k["Model"].tolist()     


class ModelTrainingEvaluationSelection:
    def __init__(self, X, y, problem_type, test_size=0.2, random_state=42,
                 custom_models=None, custom_metrics=None):
        self.X = X
        self.y = y
        self.problem_type = problem_type.lower()
        self.test_size = test_size
        self.random_state = random_state
        
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )
        
        self.trainer = ModelTrainer(problem_type, custom_models, custom_metrics)
        self.evaluator = ModelEvaluator(problem_type)
        self.selector = ModelSelector(problem_type)
    

    def run_training(self):
        print_line("Model Training","-")
        print("\nRejected Models:\n")
        self.trainer.train_all_models(self.X_train, self.X_test, self.y_train, self.y_test)
        results_df = self.trainer.get_results_dataframe()
        print(f"Training completed for {len(results_df)} models")
        return results_df
    
    def display_all_results(self, results_df):
        return self.evaluator.display_results_table(results_df, "")
    

    def get_model_selection(self, results_df, selection_type="best", k=3):
        if selection_type == "best":
            best_model_list = self.selector.select_best_model(results_df)
            print(best_model_list)
            return best_model_list

        elif selection_type == "top_k":
            top_k_list = self.selector.select_top_k_models(results_df, k)
            print_line(f"Top {k} Models")
            print(top_k_list)
            return top_k_list

        elif selection_type == "ensemble":
            top_k_list = self.selector.select_top_k_models(results_df, k)
            ensemble_result = self.selector.create_ensemble(
                self.X_train, self.X_test, self.y_train, self.y_test,
                top_k_list, self.trainer.models
            )
            print_line(f"Top {k} Models + Ensemble")
            print(top_k_list + [ensemble_result["Model"]])
            return top_k_list + [ensemble_result["Model"]]
    

    def run_complete_pipeline(self, selection_type="best", k=3):
        print_line("Model Training, Evaluation & Selection")
        print("\nInput Details ")
        print(f"Problem Type: {self.problem_type.capitalize()}")
        print(f"Dataset Shape: {self.X.shape}")
        print(f"Target Distribution: {self.y.value_counts().to_dict() if self.problem_type == 'classification' else 'Continuous values'}")
        
        results_df = self.run_training()
        
        print_line("Model Evaluation","-")
        filtered_results = self.display_all_results(results_df)
        
        print_line("Model Selection","-")
        selected_models = self.get_model_selection(results_df, selection_type, k)
        
        return {
            "all_results": filtered_results,
            "selected_models": selected_models,
            "trainer": self.trainer,
            "X_train": self.X_train,
            "X_test": self.X_test,
            "y_train": self.y_train,
            "y_test": self.y_test
        }


if __name__ == "__main__": 
    import pandas as pd
    import numpy as np
    from sklearn.base import BaseEstimator, ClassifierMixin

    df = pd.read_csv("../../datasets/heart.csv")
    X = df.drop(columns=["target"])
    y = df["target"]

    class ChebyshevKernelClassifier(BaseEstimator, ClassifierMixin):
        """
        A custom classifier based on Chebyshev distance kernel voting.
        Includes a non-standard parameter 'memory_decay' that reduces 
        influence of older samples during training.
        """
        def __init__(self, n_neighbors=5, memory_decay=1.0):
            self.n_neighbors = n_neighbors
            self.memory_decay = memory_decay 

        def fit(self, X, y):
            n = len(X)
            weights = np.power(self.memory_decay, np.arange(n)[::-1]) 
            self.X_train_ = np.array(X)
            self.y_train_ = np.array(y)
            self.weights_ = weights / np.max(weights)
            return self

        def _chebyshev_distance(self, a, b):
            return np.max(np.abs(a - b))

        def predict(self, X):
            preds = []
            for x in np.array(X):
                distances = [self._chebyshev_distance(x, x_train) for x_train in self.X_train_]
                nearest_idx = np.argsort(distances)[:self.n_neighbors]
                nearest_labels = self.y_train_[nearest_idx]
                nearest_weights = self.weights_[nearest_idx]
                label_score = {}
                for lbl, w in zip(nearest_labels, nearest_weights):
                    label_score[lbl] = label_score.get(lbl, 0) + w
                preds.append(max(label_score, key=label_score.get))
            return np.array(preds)

        def predict_proba(self, X):
            preds = self.predict(X)
            classes = np.unique(self.y_train_)
            probas = []
            for p in preds:
                row = np.zeros(len(classes))
                row[np.where(classes == p)[0][0]] = 1.0
                probas.append(row)
            return np.array(probas)

    def balanced_gain(y_true, y_pred):
        TP = np.sum((y_true == 1) & (y_pred == 1))
        TN = np.sum((y_true == 0) & (y_pred == 0))
        FP = np.sum((y_true == 0) & (y_pred == 1))
        FN = np.sum((y_true == 1) & (y_pred == 0))
        sensitivity = TP / (TP + FN + 1e-9)
        specificity = TN / (TN + FP + 1e-9)
        return sensitivity * specificity  
    
    custom_models = {
        "Chebyshev Kernel Classifier": ChebyshevKernelClassifier(
            n_neighbors=7, memory_decay=0.95
        )
    }
    custom_metrics = {
        "Balanced Gain": balanced_gain
    }

    pipeline = ModelTrainingEvaluationSelection(
        X, y, 
        problem_type="classification", 
        custom_models=custom_models, 
        custom_metrics=custom_metrics
    )

    results = pipeline.run_complete_pipeline(selection_type="best", k=3)
    print(results)
