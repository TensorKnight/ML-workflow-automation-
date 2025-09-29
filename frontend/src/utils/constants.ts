export const SUPPORTED_FILE_TYPES = {
  'text/csv': ['.csv'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/json': ['.json'],
  'application/vnd.apache.parquet': ['.parquet'],
}

export const PROBLEM_TYPES = {
  CLASSIFICATION: 'classification',
  REGRESSION: 'regression',
} as const

export const PROJECT_STATUS = {
  CREATED: 'created',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export const JOB_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export const JOB_TYPES = {
  INGESTION: 'ingestion',
  PREPROCESSING: 'preprocessing',
  FEATURE_ENGINEERING: 'feature_engineering',
  TRAINING: 'training',
} as const

export const IMPUTATION_METHODS = {
  MEAN: 'mean',
  MEDIAN: 'median',
  MODE: 'mode',
  KNN: 'knn',
  ITERATIVE: 'iterative',
} as const

export const ENCODING_METHODS = {
  ONEHOT: 'onehot',
  ORDINAL: 'ordinal',
  BINARY: 'binary',
  FREQUENCY: 'frequency',
  TARGET: 'target',
} as const

export const SCALING_METHODS = {
  STANDARD: 'standard',
  MINMAX: 'minmax',
  ROBUST: 'robust',
  MAXABS: 'maxabs',
  QUANTILE: 'quantile',
} as const

export const OUTLIER_METHODS = {
  ZSCORE: 'zscore',
  MODIFIED_ZSCORE: 'modified_zscore',
  IQR: 'iqr',
  ISOLATION_FOREST: 'isolation_forest',
  LOF: 'lof',
} as const

export const OUTLIER_ACTIONS = {
  REMOVE: 'remove',
  CAP: 'cap',
  TRANSFORM_LOG: 'transform_log',
} as const

export const FEATURE_SELECTION_METHODS = {
  UNIVARIATE: 'univariate',
  RFE: 'rfe',
  VARIANCE: 'variance',
} as const

export const MODEL_SELECTION_TYPES = {
  BEST: 'best',
  TOP_K: 'top_k',
  ENSEMBLE: 'ensemble',
} as const

export const SAMPLING_METHODS = {
  SMOTE: 'smote',
  ADASYN: 'adasyn',
  BORDERLINE_SMOTE: 'borderline_smote',
  RANDOM_OVERSAMPLE: 'random_oversample',
  RANDOM_UNDERSAMPLE: 'random_undersample',
  SMOTE_TOMEK: 'smote_tomek',
  SMOTE_ENN: 'smote_enn',
} as const

export const DEFAULT_CONFIGS = {
  PREPROCESSING: {
    imputation: {
      mean: [],
      median: [],
      mode: [],
      knn: [],
      iterative: [],
    },
    encoding: {
      onehot: [],
      ordinal: [],
      binary: [],
      frequency: [],
      target: [],
    },
    scaling: {
      standard: [],
      minmax: [],
      robust: [],
      maxabs: [],
      quantile: [],
    },
    outlier: {
      method: 'zscore',
      threshold: 3,
      action: 'cap',
      columns: null,
      percentile_low: 0.05,
      percentile_high: 0.95,
    },
    class_imbalance: {
      method: 'smote',
      k_neighbors: 5,
    },
  },
  FEATURE_ENGINEERING: {
    auto_features: {
      polynomial: true,
      interaction: true,
      statistical: true,
      log_transform: true,
    },
    manual_features: [],
    selection: {
      method: 'univariate',
      k_features: 20,
    },
  },
  TRAINING: {
    test_size: 0.2,
    random_state: 42,
    selection_type: 'best',
    k_models: 3,
  },
} as const

