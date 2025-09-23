import pandas as pd
import numpy as np
import sqlite3
import json
import re
from typing import Dict, List, Any, Optional, Tuple, Union
from pathlib import Path
import warnings
from datetime import datetime
from scipy import stats
import seaborn as sns
import matplotlib.pyplot as plt
from dataclasses import dataclass, field
from enum import Enum
import logging
import io
from tabulate import tabulate
import shutil
warnings.filterwarnings('ignore')

def get_line(title="", char="=", width=None):
    if width is None:
        width = shutil.get_terminal_size().columns
    if title:
        return f"{title.center(width, char)}"
    else:
        return char * width

class FileType(Enum):
    CSV = "csv"
    JSON = "json"
    EXCEL = "excel" 
    PARQUET = "parquet"
    SQL = "sql"
    TSV = "tsv"

@dataclass
class ColumnSchema:
    name: str
    dtype: str
    nullable: bool = True
    unique: bool = False
    min_value: Optional[Union[int, float]] = None
    max_value: Optional[Union[int, float]] = None
    allowed_values: Optional[List[Any]] = None
    regex_pattern: Optional[str] = None
    description: Optional[str] = None

@dataclass
class DataSchema:
    columns: List[ColumnSchema]
    target_column: Optional[str] = None
    
    def get_column_schema(self, column_name: str) -> Optional[ColumnSchema]:
        return next((col for col in self.columns if col.name == column_name), None)

@dataclass
class QualityIssue:
    severity: str
    category: str
    column: Optional[str]
    message: str
    count: Optional[int] = None
    percentage: Optional[float] = None

@dataclass
class DataQualityReport:
    total_rows: int
    total_columns: int
    issues: List[QualityIssue] = field(default_factory=list)
    pros: List[str] = field(default_factory=list)
    cons: List[str] = field(default_factory=list)
    summary_stats: Dict[str, Any] = field(default_factory=dict)

class FileTypeDetector:
    @staticmethod
    def detect_file_type(file_path: str) -> FileType:
        path = Path(file_path)
        extension = path.suffix.lower()
        
        type_mapping = {
            '.csv': FileType.CSV,
            '.json': FileType.JSON,
            '.xlsx': FileType.EXCEL,
            '.xls': FileType.EXCEL,
            '.parquet': FileType.PARQUET,
            '.db': FileType.SQL,
            '.sqlite': FileType.SQL,
            '.tsv': FileType.TSV
        }
        
        return type_mapping.get(extension, FileType.CSV)

class DataLoader:
    @staticmethod
    def load_data(file_path: str, **kwargs) -> pd.DataFrame:
        file_type = FileTypeDetector.detect_file_type(file_path)
        
        loaders = {
            FileType.CSV: lambda p: pd.read_csv(p, **kwargs),
            FileType.JSON: lambda p: pd.read_json(p, **kwargs),
            FileType.EXCEL: lambda p: pd.read_excel(p, **kwargs),
            FileType.PARQUET: lambda p: pd.read_parquet(p, **kwargs),
            FileType.TSV: lambda p: pd.read_csv(p, sep='\t', **kwargs),
            FileType.SQL: DataLoader._load_from_sql
        }
        
        return loaders[file_type](file_path)
    
    @staticmethod
    def _load_from_sql(file_path: str, query: str = None, **kwargs) -> pd.DataFrame:
        conn = sqlite3.connect(file_path)
        if query:
            df = pd.read_sql_query(query, conn, **kwargs)
        else:
            tables = pd.read_sql_query("SELECT name FROM sqlite_master WHERE type='table';", conn)
            if len(tables) > 0:
                table_name = tables.iloc[0]['name']
                df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn, **kwargs)
            else:
                raise ValueError("No tables found in database")
        conn.close()
        return df

class SchemaValidator:
    def __init__(self, schema: DataSchema):
        self.schema = schema
    
    def validate_schema_against_data(self, df: pd.DataFrame) -> List[QualityIssue]:
        issues = []
        
        schema_columns = {col.name for col in self.schema.columns}
        data_columns = set(df.columns)
        
        missing_columns = schema_columns - data_columns
        extra_columns = data_columns - schema_columns
        
        for col in missing_columns:
            issues.append(QualityIssue(
                severity="ERROR",
                category="Schema",
                column=col,
                message=f"Required column '{col}' is missing from dataset"
            ))
        
        for col in extra_columns:
            issues.append(QualityIssue(
                severity="WARNING",
                category="Schema",
                column=col,
                message=f"Unexpected column '{col}' found in dataset"
            ))
        
        return issues

class DataQualityChecker:
    def __init__(self, df: pd.DataFrame, schema: Optional[DataSchema] = None):
        self.df = df
        self.schema = schema
        self.issues = []
        self.pros = []
        self.cons = []
    
    def check_data_quality(self) -> DataQualityReport:
        self._check_basic_info()
        self._check_data_types()
        self._check_missing_values()
        self._check_duplicates()
        self._check_uniqueness()
        self._check_range_constraints()
        self._check_domain_constraints()
        self._check_regex_patterns()
        self._check_class_imbalance()
        self._check_value_distributions()
        self._check_wrong_values()
        
        return DataQualityReport(
            total_rows=len(self.df),
            total_columns=len(self.df.columns),
            issues=self.issues,
            pros=self.pros,
            cons=self.cons,
            summary_stats=self._generate_summary_stats()
        )
    
    def _check_basic_info(self):
        if len(self.df) == 0:
            self._add_issue("ERROR", "Basic", None, "Dataset is empty")
            self.cons.append("❌ Dataset contains no rows")
        elif len(self.df) < 10:
            self._add_issue("WARNING", "Basic", None, f"Dataset has very few rows ({len(self.df)})")
            self.cons.append(f"❌ Dataset has very few rows ({len(self.df)})")
        else:
            self.pros.append(f"✅ Dataset contains {len(self.df):,} rows")
        
        if len(self.df.columns) == 0:
            self._add_issue("ERROR", "Basic", None, "Dataset has no columns")
            self.cons.append("❌ Dataset contains no columns")
        elif len(self.df.columns) < 3:
            self._add_issue("WARNING", "Basic", None, f"Dataset has very few columns ({len(self.df.columns)})")
            self.cons.append(f"❌ Dataset has very few columns ({len(self.df.columns)})")
        else:
            self.pros.append(f"✅ Dataset contains {len(self.df.columns)} columns")

        if self.schema and self.schema.target_column:
            if self.schema.target_column not in self.df.columns:
                self._add_issue("ERROR", "Target", self.schema.target_column, f"Target column '{self.schema.target_column}' is missing from dataset")
                self.cons.append(f"❌ Target column '{self.schema.target_column}' is missing from dataset")
            else:
                self.pros.append(f"✅ Target column '{self.schema.target_column}' is present")

    
    def _check_data_types(self):
        if not self.schema:
            return
            
        type_mapping = {
            'int': ['int64', 'int32', 'int16', 'int8'],
            'float': ['float64', 'float32'],
            'string': ['object', 'string'],
            'datetime': ['datetime64[ns]'],
            'bool': ['bool']
        }
        
        correct_types = 0
        total_schema_columns = 0
        
        for col_schema in self.schema.columns:
            if col_schema.name in self.df.columns:
                total_schema_columns += 1
                actual_dtype = str(self.df[col_schema.name].dtype)
                expected_types = type_mapping.get(col_schema.dtype, [col_schema.dtype])
                
                if actual_dtype in expected_types:
                    correct_types += 1
                else:
                    self._add_issue("WARNING", "DataType", col_schema.name,
                                  f"Expected {col_schema.dtype}, got {actual_dtype}")
                    self.cons.append(f"❌ Column '{col_schema.name}' has incorrect data type (expected {col_schema.dtype}, got {actual_dtype})")
        
        if total_schema_columns > 0 and correct_types == total_schema_columns:
            self.pros.append("✅ All columns have correct data types")
        elif correct_types > 0:
            self.pros.append(f"✅ {correct_types}/{total_schema_columns} columns have correct data types")
    
    def _check_missing_values(self):
        missing_counts = self.df.isnull().sum()
        total_missing = missing_counts.sum()
        
        if total_missing == 0:
            self.pros.append("✅ No missing values found")
        else:
            columns_with_missing = missing_counts[missing_counts > 0]
            for col, count in columns_with_missing.items():
                percentage = (count / len(self.df)) * 100
                if percentage >= 70:
                    self._add_issue("WARNING", "Missing", col,
                                  f"{count} missing values ({percentage:.1f}%)",
                                  count, percentage)
                self.cons.append(f"❌ Column '{col}' has {count} missing values ({percentage:.1f}%)")
        
        if self.schema:
            for col_schema in self.schema.columns:
                if col_schema.name in self.df.columns and not col_schema.nullable:
                    if self.df[col_schema.name].isnull().sum() > 0:
                        self._add_issue("ERROR", "Missing", col_schema.name,
                                      f"Column marked as non-nullable but contains missing values")
                        self.cons.append(f"❌ Non-nullable column '{col_schema.name}' contains missing values")
    
    def _check_duplicates(self):
        duplicate_rows = self.df.duplicated(keep='first').sum()
        if duplicate_rows == 0:
            self.pros.append("✅ No duplicate rows found")
        else:
            percentage = (duplicate_rows / len(self.df)) * 100
            if percentage >= 70:
                self._add_issue("WARNING", "Duplicates", None,
                    f"{duplicate_rows} duplicate rows ({percentage:.1f}%)",
                    duplicate_rows, percentage)
            self.cons.append(f"❌ {duplicate_rows} duplicate rows found ({percentage:.1f}%)")
            counts = self.df.value_counts()
            for row_vals, count in counts.items():
                if count > 1:
                    self.cons.append(f"❌ Row {tuple(row_vals)} appears {count} times → {count-1} duplicates")
    
    def _check_uniqueness(self):
        if not self.schema:
            return
            
        for col_schema in self.schema.columns:
            if col_schema.name in self.df.columns and col_schema.unique:
                unique_count = self.df[col_schema.name].nunique()
                non_null_count = self.df[col_schema.name].count()
                
                if unique_count == non_null_count:
                    self.pros.append(f"✅ Column '{col_schema.name}' maintains uniqueness constraint")
                else:
                    duplicates = non_null_count - unique_count
                    self._add_issue("ERROR", "Uniqueness", col_schema.name,
                                  f"Column should be unique but has {duplicates} duplicates")
                    self.cons.append(f"❌ Column '{col_schema.name}' should be unique but has {duplicates} duplicates")
    
    def _check_range_constraints(self):
        if not self.schema:
            return
            
        for col_schema in self.schema.columns:
            if col_schema.name in self.df.columns:
                col_data = self.df[col_schema.name]
                
                if pd.api.types.is_numeric_dtype(col_data):
                    if col_schema.min_value is not None:
                        below_min = (col_data < col_schema.min_value).sum()
                        if below_min > 0:
                            self._add_issue("ERROR", "Range", col_schema.name,
                                          f"{below_min} values below minimum ({col_schema.min_value})",
                                          below_min)
                            self.cons.append(f"❌ Column '{col_schema.name}' has {below_min} values below minimum ({col_schema.min_value})")
                        else:
                            self.pros.append(f"✅ Column '{col_schema.name}' respects minimum value constraint")
                    
                    if col_schema.max_value is not None:
                        above_max = (col_data > col_schema.max_value).sum()
                        if above_max > 0:
                            self._add_issue("ERROR", "Range", col_schema.name,
                                          f"{above_max} values above maximum ({col_schema.max_value})",
                                          above_max)
                            self.cons.append(f"❌ Column '{col_schema.name}' has {above_max} values above maximum ({col_schema.max_value})")
                        else:
                            self.pros.append(f"✅ Column '{col_schema.name}' respects maximum value constraint")
    
    def _check_domain_constraints(self):
        if not self.schema:
            return
            
        for col_schema in self.schema.columns:
            if col_schema.name in self.df.columns and col_schema.allowed_values:
                col_data = self.df[col_schema.name].dropna()
                invalid_values = ~col_data.isin(col_schema.allowed_values)
                invalid_count = invalid_values.sum()
                
                if invalid_count == 0:
                    self.pros.append(f"✅ Column '{col_schema.name}' contains only allowed values")
                else:
                    unique_invalid = col_data[invalid_values].unique()
                    self._add_issue("ERROR", "Domain", col_schema.name,
                                  f"{invalid_count} values not in allowed domain: {list(unique_invalid)[:5]}",
                                  invalid_count)
                    self.cons.append(f"❌ Column '{col_schema.name}' has {invalid_count} values outside allowed domain")
    
    def _check_regex_patterns(self):
        if not self.schema:
            return
            
        for col_schema in self.schema.columns:
            if col_schema.name in self.df.columns and col_schema.regex_pattern:
                col_data = self.df[col_schema.name].dropna().astype(str)
                pattern = re.compile(col_schema.regex_pattern)
                invalid_pattern = ~col_data.str.match(pattern, na=False)
                invalid_count = invalid_pattern.sum()
                
                if invalid_count == 0:
                    self.pros.append(f"✅ Column '{col_schema.name}' matches required pattern")
                else:
                    self._add_issue("ERROR", "Pattern", col_schema.name,
                                  f"{invalid_count} values don't match pattern '{col_schema.regex_pattern}'",
                                  invalid_count)
                    self.cons.append(f"❌ Column '{col_schema.name}' has {invalid_count} values not matching required pattern")
    
    def _check_class_imbalance(self):
        if not self.schema or not self.schema.target_column:
            return
            
        if self.schema.target_column in self.df.columns:
            target_counts = self.df[self.schema.target_column].value_counts()
            total_count = target_counts.sum()
            
            if len(target_counts) > 1:
                min_class_ratio = target_counts.min() / total_count
                max_class_ratio = target_counts.max() / total_count
                
                if min_class_ratio < 0.1:  
                    self._add_issue("WARNING", "Imbalance", self.schema.target_column,
                                  f"Severe class imbalance detected. Smallest class: {min_class_ratio:.1%}")
                    self.cons.append(f"❌ Severe class imbalance in target column (smallest class: {min_class_ratio:.1%})")
                elif min_class_ratio < 0.3:
                    self._add_issue("INFO", "Imbalance", self.schema.target_column,
                                  f"Moderate class imbalance detected. Smallest class: {min_class_ratio:.1%}")
                    self.cons.append(f"❌ Moderate class imbalance in target column (smallest class: {min_class_ratio:.1%})")
                else:
                    self.pros.append(f"✅ Target column classes are reasonably balanced")
    
    def _check_value_distributions(self):
        numeric_columns = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_columns:
            skewness = stats.skew(self.df[col].dropna())
            
            if abs(skewness) > 2:
                self._add_issue("WARNING", "Distribution", col,
                              f"Highly skewed distribution (skewness: {skewness:.2f})")
                self.cons.append(f"❌ Column '{col}' has highly skewed distribution (skewness: {skewness:.2f})")
            elif abs(skewness) > 1:
                self._add_issue("INFO", "Distribution", col,
                              f"Moderately skewed distribution (skewness: {skewness:.2f})")
            else:
                self.pros.append(f"✅ Column '{col}' has approximately normal distribution")
        
        for col in self.df.select_dtypes(include=['object']).columns:
            value_counts = self.df[col].value_counts()
            if len(value_counts) > 0:
                most_common_ratio = value_counts.iloc[0] / len(self.df)
                
                if most_common_ratio > 0.9:
                    self._add_issue("WARNING", "Distribution", col,
                                  f"Highly concentrated values ({most_common_ratio:.1%} in most common category)")
                    self.cons.append(f"❌ Column '{col}' has highly concentrated values ({most_common_ratio:.1%} in most common)")
                elif most_common_ratio > 0.7:
                    self._add_issue("INFO", "Distribution", col,
                                  f"Moderately concentrated values ({most_common_ratio:.1%} in most common category)")
                else:
                    self.pros.append(f"✅ Column '{col}' has well-distributed values")
    
    def _check_wrong_values(self):
        for col in self.df.columns:
            if pd.api.types.is_numeric_dtype(self.df[col]):
                infinite_values = np.isinf(self.df[col]).sum()
                if infinite_values > 0:
                    self._add_issue("ERROR", "Invalid", col,
                                  f"{infinite_values} infinite values detected",
                                  infinite_values)
                    self.cons.append(f"❌ Column '{col}' contains {infinite_values} infinite values")
                else:
                    self.pros.append(f"✅ Column '{col}' contains no infinite values")
                
                if col.lower() in ['age', 'price', 'salary', 'income']:
                    negative_values = (self.df[col] < 0).sum()
                    if negative_values > 0:
                        self._add_issue("ERROR", "Logic", col,
                                      f"{negative_values} negative values in column that should be positive",
                                      negative_values)
                        self.cons.append(f"❌ Column '{col}' contains {negative_values} negative values (should be positive)")
            
            elif pd.api.types.is_object_dtype(self.df[col]):
                empty_strings = (self.df[col] == '').sum()
                whitespace_only = (self.df[col].str.strip() == '').sum() - empty_strings
                
                if empty_strings > 0:
                    self._add_issue("WARNING", "Invalid", col,
                                  f"{empty_strings} empty string values",
                                  empty_strings)
                    self.cons.append(f"❌ Column '{col}' contains {empty_strings} empty strings")
                
                if whitespace_only > 0:
                    self._add_issue("WARNING", "Invalid", col,
                                  f"{whitespace_only} whitespace-only values",
                                  whitespace_only)
                    self.cons.append(f"❌ Column '{col}' contains {whitespace_only} whitespace-only values")
    
    def _add_issue(self, severity: str, category: str, column: Optional[str], 
                   message: str, count: Optional[int] = None, percentage: Optional[float] = None):
        self.issues.append(QualityIssue(severity, category, column, message, count, percentage))
    
    def _generate_summary_stats(self) -> Dict[str, Any]:
        buffer = {}
        info_buf = io.StringIO()
        self.df.info(buf=info_buf)
        buffer['info'] = info_buf.getvalue()
        buffer['describe'] = self.df.describe().T.to_dict()
        buffer['shape'] = self.df.shape
        buffer['columns'] = self.df.columns.tolist()
        buffer['nunique'] = self.df.nunique().to_dict()
        buffer['memory_usage'] = self.df.memory_usage(deep=True).sum()
        buffer['dtypes'] = self.df.dtypes.apply(lambda x: str(x)).to_dict()
    
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        categorical_cols = list(self.df.select_dtypes(include=['object', 'category']).columns)
        for col in numeric_cols:
            if self.df[col].nunique() < 20:
                categorical_cols.append(col)
    
        buffer['numeric_summary'] = {}
        for col in numeric_cols:
            buffer['numeric_summary'][col] = {
                'mean': self.df[col].mean(),
                'std': self.df[col].std(),
                'min': self.df[col].min(),
                'max': self.df[col].max()
            }
    
        buffer['categorical_summary'] = {}
        for col in categorical_cols:
            vc = self.df[col].value_counts()
            buffer['categorical_summary'][col] = {
                'unique_count': vc.shape[0],
                'most_common': vc.idxmax() if len(vc) > 0 else None
            }
    
        return buffer



class ReportGenerator:
    @staticmethod
    def generate_report(report: DataQualityReport, dataset_name: str = "Dataset") -> str:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        output = []
        output.append(get_line(f"  Data Ingestion & Quality Report : {dataset_name} ", "="))
        output.append(f"\n\nGenerated on: {timestamp}")
        output.append(f"Total Rows: {report.total_rows:,}")
        output.append(f"Total Columns: {report.total_columns}")
        if hasattr(report, "runtime"):
            mins, secs = divmod(report.runtime, 60)
            output.append(f"Runtime: {int(mins)} min {secs:.2f} sec")
        output.append("")
        
        if report.issues:
            
            issues_by_severity = {}
            for issue in report.issues:
                if issue.severity not in issues_by_severity:
                    issues_by_severity[issue.severity] = []
                issues_by_severity[issue.severity].append(issue)
            
            for severity in ['ERROR', 'WARNING', 'INFO']:
                if severity in issues_by_severity:
                    output.append(f"\n{severity}S:")
                    for issue in issues_by_severity[severity]:
                        column_info = f" (Column: {issue.column})" if issue.column else ""
                        count_info = f" - {issue.count} occurrences" if issue.count else ""
                        output.append(f"  • {issue.message}{column_info}{count_info}")
            output.append("\n")
        
        output.append(get_line("✅ DATA PROS", "-"))
        if report.pros:
            for pro in report.pros:
                output.append(f"  {pro}")
        else:
            output.append("  No positive aspects identified")
        output.append("\n")
        
        output.append(get_line("❌ DATA CONS", "-"))
        if report.cons:
            for con in report.cons:
                output.append(f"  {con}")
        else:
            output.append("  No negative aspects identified")
        output.append("\n")
        
        if report.summary_stats:
            output.append(get_line("📊 SUMMARY STATISTICS", "-"))
            stats = report.summary_stats
            
            output.append("\nDataFrame Info:\n" + stats.get('info', 'No info available'))
            output.append(f"\nShape: {stats['shape']}")
            output.append(f"Memory Usage: {stats['memory_usage'] / (1024*1024):.2f} MB")
            dtypes_df = pd.DataFrame.from_dict(stats['dtypes'], orient="index", columns=["dtype"])
            output.append("\nData Types:\n" + tabulate(dtypes_df, headers="keys", tablefmt="fancy_grid"))
            
            if "describe" in stats:
                desc_df = pd.DataFrame(stats["describe"]).T
                output.append("\nDescriptive Statistics:\n" + tabulate(desc_df, headers="keys", tablefmt="fancy_grid"))
            
            if "nunique" in stats:
                nunique_df = pd.DataFrame.from_dict(stats["nunique"], orient="index", columns=["Unique Values"])
                output.append("\nUnique Values per Column:\n" + tabulate(nunique_df, headers="keys", tablefmt="fancy_grid"))
            
            if "numeric_summary" in stats:
                num_df = pd.DataFrame(stats["numeric_summary"]).T
                output.append("\nNumeric Columns Summary:\n" + tabulate(num_df, headers="keys", tablefmt="fancy_grid"))
            
            if "categorical_summary" in stats:
                cat_df = pd.DataFrame(stats["categorical_summary"]).T
                output.append("\nCategorical Columns Summary:\n" + tabulate(cat_df, headers="keys", tablefmt="fancy_grid"))
        
        output.append("")
        
        return "\n".join(output)





class DataIngestion:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def process_data(self, file_path: str = None, schema: Optional[DataSchema] = None, 
                     dataset_name: str = "Dataset", merge_config: Optional[Dict] = None, **load_kwargs) -> Tuple[pd.DataFrame, str]:
        try:
            import time
            start_time = time.time()
            
            if merge_config:
                datasets_dict = merge_config.get("datasets", {})
                how = merge_config.get("how", "left")
                on = merge_config.get("on", [])
                
                merged_df = None
                for key, path in datasets_dict.items():
                    print(f"🔄 Loading dataset '{key}' from: {path}")
                    df_temp = DataLoader.load_data(path, **load_kwargs)
                    print(f"✅ Loaded {len(df_temp)} rows and {len(df_temp.columns)} columns from '{key}'")
                    
                    if merged_df is None:
                        merged_df = df_temp
                    else:
                        merged_df = pd.merge(merged_df, df_temp, how=how, on=on)
                        print(f"🔗 Merged dataset '{key}' with shape {merged_df.shape}")
                
                df = merged_df
            else:
                print(f"🔄 Loading data from: {file_path}")
                df = DataLoader.load_data(file_path, **load_kwargs)
                print(f"✅ Successfully loaded {len(df)} rows and {len(df.columns)} columns")
            
            if schema:
                print("🔍 Validating schema...")
                schema_validator = SchemaValidator(schema)
                schema_issues = schema_validator.validate_schema_against_data(df)
                if schema_issues:
                    print(f"⚠️  Found {len(schema_issues)} schema validation issues")
                    for issue in schema_issues:
                        print(f"   - {issue.message}")
            
            print("🔍 Running data quality checks...")
            quality_checker = DataQualityChecker(df, schema)
            quality_report = quality_checker.check_data_quality()
            quality_report.runtime = time.time() - start_time
            
            print("📄 Generating report...")
            report_text = ReportGenerator.generate_report(quality_report, dataset_name)
            
            print("✅ Data ingestion completed successfully!\n")
            return df, report_text
            
        except Exception as e:
            error_msg = f"❌ Error during data ingestion: {str(e)}"
            print(error_msg)
            raise


if __name__ == "__main__":
    import pandas as pd
    import numpy as np
    import time
    import h2o

    # ---------------- Custom Data Ingestion ----------------
    schema_heart = DataSchema(
        columns=[
            ColumnSchema(name="age", dtype="int", min_value=0),
            ColumnSchema(name="sex", dtype="int"),           # 0=female, 1=male
            ColumnSchema(name="cp", dtype="int"),            # chest pain type
            ColumnSchema(name="trestbps", dtype="int", min_value=0),  # resting blood pressure
            ColumnSchema(name="chol", dtype="int", min_value=0),      # cholesterol
            ColumnSchema(name="fbs", dtype="int"),           # fasting blood sugar
            ColumnSchema(name="restecg", dtype="int"),       # resting ECG results
            ColumnSchema(name="thalach", dtype="int", min_value=0),   # max heart rate
            ColumnSchema(name="exang", dtype="int"),         # exercise induced angina
            ColumnSchema(name="oldpeak", dtype="float", min_value=0), # ST depression
            ColumnSchema(name="slope", dtype="int"),         # slope of ST segment
            ColumnSchema(name="ca", dtype="int"),            # number of vessels
            ColumnSchema(name="thal", dtype="int"),          # thalassemia
            ColumnSchema(name="target", dtype="int", min_value=0, max_value=1)  # 0=no, 1=yes
        ],
        target_column="target"
    )

    ingestion = DataIngestion()
    df_custom, report = ingestion.process_data(
        "../../datasets/heart.csv",
        schema=schema_heart,
        dataset_name="Heart Disease Dataset"
    )
    print(report)

