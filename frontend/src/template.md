# Heart Disease Prediction

## 1. Project Introduction & Overview

### 1.0. Overview

A machine learning tool that predicts the risk of heart disease in humans.

### 1.1. Project Introduction

The Heart Disease Prediction Project aims to develop a robust machine learning pipeline to predict the presence of heart disease based on clinical and demographic data. The project integrates data preprocessing, feature engineering, and model training & evaluation into a modular workflow.

---

## 2. Table of Contents 

| No. | Section Title                   | Link                                                                                 |
| --- | ------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | Project Introduction & Overview | [1. Project Introduction & Overview](#1-project-introduction--overview)              |
| 2   | Table of Contents               | [2. Table of Contents](#2-table-of-contents)                                         |
| 3   | Problem Statement & Solution    | [3. Problem Statement & Solution](#3-problem-statement--solution)                    |
| 4   | Tech Stack                      | [4. Tech Stack](#4-tech-stack)                                                       |
| 5   | Dataset Information             | [5. Dataset Information](#5-dataset-information)                                     |
| 6   | Data Preprocessing              | [6. Data Preprocessing](#6-data-preprocessing)                                       |
| 7   | Feature Engineering             | [7. Feature Engineering](#7-feature-engineering)                                     |
| 8   | Modeling Approach & Pipeline    | [8. Model Training, Evaluation & Selection](#8-model-training-evaluation--selection) |
| 9   | License                         | [9. License](#9-license)                                                             |


---

## 3. Problem Statement & Solution

### 3.0. Problem Statement 

Heart disease is one of the leading causes of mortality worldwide. Early detection is crucial for timely intervention and improving patient outcomes. However, diagnosing heart disease often requires analyzing multiple clinical and demographic factors, which can be time-consuming and prone to human error. The challenge is to build a reliable system that can predict the presence of heart disease accurately using available patient data.

### 3.1. Solution 
 
This project presents a machine learning pipeline that automates the detection of heart disease. The system preprocesses the data to handle missing values, outliers, and scaling, while encoding categorical features appropriately. It then performs feature engineering to create meaningful features that capture important relationships between clinical parameters. Multiple machine learning models, including custom classifiers, are trained and evaluated, and the best-performing model is selected based on metrics such as Accuracy, AUC, F1-score, and Balanced Gain. The resulting system provides a robust and interpretable classifier that can assist healthcare professionals in identifying patients at risk and making informed decisions.

---

## 4. Teck Stack

| **Category**                   | **Technology**                                                              |
| ------------------------------ | --------------------------------------------------------------------------- |
| **Programming Language**       | Python                                                                      |
| **Data Processing**            | Pandas, NumPy, Scikit-learn                                                 |
| **Modeling & ML**              | Scikit-learn, XGBoost, LightGBM                                             |
| **Evaluation & Visualization** | Matplotlib, Seaborn                                                         |
| **Model Training Pipeline**    | Jupyter Notebooks, Modular Python Scripts                                   |


---

## 5. Dataset Information

### 5.1. Dataset Details 

The dataset contains clinical and demographic features used to predict the presence of heart disease. It can be used for tasks such as disease classification, medical risk prediction, and health analytics. Below is the detailed description of each column:

* **age**: Age of the patient (in years).
* **sex**: Sex of the patient (1 = Male, 0 = Female).
* **cp** (*Chest Pain Type*):

  * 0 = Typical angina
  * 1 = Atypical angina
  * 2 = Non-anginal pain
  * 3 = Asymptomatic
* **trestbps** (*Resting Blood Pressure*): Resting blood pressure (in mm Hg) on admission to the hospital.
* **chol** (*Serum Cholesterol*): Serum cholesterol level (in mg/dl).
* **fbs** (*Fasting Blood Sugar*): Binary indicator — (1 = Fasting blood sugar > 120 mg/dl, 0 = otherwise).
* **restecg** (*Resting Electrocardiographic Results*):

  * 0 = Normal
  * 1 = ST-T wave abnormality
  * 2 = Left ventricular hypertrophy
* **thalach** (*Maximum Heart Rate Achieved*): Maximum heart rate during exercise test.
* **exang** (*Exercise-Induced Angina*): (1 = Yes, 0 = No).
* **oldpeak**: ST depression induced by exercise relative to rest (a measure of exercise-induced ischemia).
* **slope** (*Slope of the Peak Exercise ST Segment*):

  * 0 = Upsloping
  * 1 = Flat
  * 2 = Downsloping
* **ca** (*Number of Major Vessels*): Number of major vessels (0–3) colored by fluoroscopy.
* **thal** (*Thalassemia*):

  * 1 = Normal
  * 2 = Fixed defect
  * 3 = Reversible defect
* **target** (*Presence of Heart Disease*): Binary target variable (1 = Heart disease, 0 = No heart disease).




### 5.2. Dataset Ingestion Overview 

#### 5.2.1.  Data Ingestion

The dataset was ingested using a custom schema validation pipeline. Each column was validated against predefined constraints such as data type, value ranges, and presence of the target column.

* **Source file:** `heart.csv`
* **Rows loaded:** `1,025`
* **Columns:** `14`
* **Target Column:** `target` (0 = No Heart Disease, 1 = Heart Disease)
* **Runtime:** ~0.19 sec


#### 5.2.2. Data Quality Checks – Summary

**Strengths (Data Pros):**

* Dataset contains all required **14 features + target**.
* No missing values detected across columns.
* All columns respect their minimum/maximum constraints.
* Data types match the schema (`int`/`float`).
* Target column is **reasonably balanced** (healthy distribution of classes).
* Most columns follow an approximately **normal distribution**.
* No infinite values found.

**Weaknesses (Data Cons):**

* **Duplicate rows detected:** 723 rows (≈70.5% of dataset).

  * Example: Row `(38, 1, 2, 138, 175, 0, 1, 173, 0, 0.0, 2, 4, 2, 1)` appears **8 times**.
* Several columns show **moderate skewness**, which may affect model training:

  * `chol` (Cholesterol): Skewness ≈ 1.07
  * `fbs` (Fasting Blood Sugar): Skewness ≈ 1.97
  * `oldpeak`: Skewness ≈ 1.21
  * `ca` (number of vessels): Skewness ≈ 1.26

---

#### 5.2.3. Data Insights

* While the dataset is rich and clean in terms of missing values and type constraints, **high duplication (70.5%)** could bias the model if not addressed.
* Feature distributions indicate potential need for **normalization/transformations** for skewed variables.
* Deduplication and outlier treatment will likely improve downstream model performance.

---

## 6. Data Preprocessing

The **Heart Disease dataset** was preprocessed using a configurable and modular pipeline. The pipeline ensures that data is cleaned, encoded, scaled, and transformed to be ready for machine learning models.


### 6.1. Preprocessing Workflow

The pipeline was applied to `heart.csv` using the following configuration:

1. **Imputation**

   * Missing values in numerical columns (`age`, `trestbps`, `chol`, `thalach`, `oldpeak`) filled with **mean**.
   * Missing values in categorical columns (`sex`, `cp`, `fbs`, `restecg`, `exang`, `slope`, `ca`, `thal`) filled with **mode**.
   * No KNN imputation applied.

2. **Encoding**

   * **One-Hot Encoding:** `cp`, `restecg`, `slope`, `thal`.
   * **Frequency Encoding:** `ca`.
   * **Binary Encoding:** `sex`, `fbs`, `exang`.

3. **Scaling**

   * **Standard Scaling:** `age`, `trestbps`, `chol`, `thalach`, `oldpeak`.

4. **Outlier Handling**

   * Method: **Z-score** (threshold = 3).
   * Action: **Capping** at 5th–95th percentile.
   * Columns: `age`, `trestbps`, `chol`, `thalach`, `oldpeak`.

5. **Rare Category Handling**

   * Column: `ca`.
   * Rare categories below **10% frequency** replaced with `"Other"`.

6. **Skewness Transformation**

   * Method: **Log transformation**.
   * Columns: `chol`, `oldpeak`.

7. **Class Imbalance Handling**

   * Method: **SMOTE (Synthetic Minority Oversampling Technique)** with 3 nearest neighbors.


### 6.2. Preprocessing Summary

#### 6.2.1. Before Processing

* **Shape:** (1025, 14)
* **Missing Values:** 0
* **Duplicate Rows:** 723
* **Numerical Columns:** `['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target']`
* **Categorical Columns:** None explicitly (all stored as numeric codes).
* **Outlier Columns:** `['trestbps', 'chol', 'thalach', 'oldpeak', 'ca', 'thal']`
* **Highly Correlated Columns:** None


#### 6.2.2. After Processing

* **Shape:** (1052, 24)
* **Missing Values:** 0
* **Duplicate Rows:** 748
* **Numerical Columns:** Expanded with encoded features such as `cp_0`, `restecg_2`, `slope_1`, `thal_3`, etc.
* **Constant/Quasi-Constant Columns:** `['sex_bit_0', 'fbs_bit_0', 'exang_bit_0']`
* **Outlier Columns:** Some dummy variables flagged (`cp_3`, `restecg_2`, `slope_0`, `thal_0`, `thal_1`).
* **Highly Correlated Columns:** Example → `('restecg_0', 'restecg_1')`.


#### 6.3. Processed Data Preview

| age       | trestbps  | chol      | thalach   | oldpeak   | ca  | cp_0 | cp_1 | cp_2 | cp_3 | … | thal_3 | sex_bit_0 | fbs_bit_0 | exang_bit_0 | target |
| --------- | --------- | --------- | --------- | --------- | --- | ---- | ---- | ---- | ---- | - | ------ | --------- | --------- | ----------- | ------ |
| -0.287767 | -0.408622 | -0.747537 | 0.875619  | 0.139014  | 134 | 1.0  | 0.0  | 0.0  | 0.0  | … | 1.0    | 1         | 1         | 1           | 0      |
| -0.170253 | 0.570977  | -0.952782 | 0.264813  | 1.725708  | 578 | 1.0  | 0.0  | 0.0  | 0.0  | … | 1.0    | 1         | 1         | 1           | 0      |
| 1.592463  | 0.897510  | -1.591322 | -1.144740 | 1.417165  | 578 | 1.0  | 0.0  | 0.0  | 0.0  | … | 1.0    | 1         | 1         | 1           | 0      |
| 0.769863  | 1.093430  | -0.952782 | 0.546723  | -1.073415 | 226 | 1.0  | 0.0  | 0.0  | 0.0  | … | 1.0    | 1         | 1         | 1           | 0      |
| 0.887377  | 0.440364  | 1.122473  | -1.943487 | 0.923540  | 87  | 1.0  | 0.0  | 0.0  | 0.0  | … | 0.0    | 1         | 1         | 1           | 0      |

---



## 7. Feature Engineering

The **Heart Disease dataset** underwent **manual and automated feature engineering** to enhance model performance. Both **domain-driven features** and **statistical feature selection** methods were applied using a configurable pipeline.


### 7.1. Feature Engineering Workflow

The pipeline was applied to `heart.csv` with the following configuration:

1. **Manual Features (Domain-Specific)**

   * `age_trestbps_ratio = age / trestbps`
   * `chol_thalach_product = chol * thalach`
   * `oldpeak_per_trestbps = oldpeak / (trestbps + 1)`
   * `age_chol_sum = age + chol`

   These features were designed to capture **interactions** and **ratios** relevant to cardiovascular health indicators.

2. **Automated Feature Engineering**

   * **Type:** Both (numerical & categorical).
   * **Selection Method:** Univariate statistical tests.
   * **K Features:** Top 15 selected based on their predictive power with respect to the `target`.

3. **Feature Filtering**

   * Removal of **redundant or low-variance features**.
   * Preservation of features with **high signal-to-noise ratio**.



### 7.2. Feature Summary

#### 7.2.1. Before Feature Engineering

* **Shape:** (1025, 13)
* **Features:** `age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal`
* **Engineered Features:** None

#### 7.2.2. After Feature Engineering

* **Shape:** (1025, 17)
* **Features:** Original 13 + 4 engineered features
* **Selected Features (Top 15):**
  `age, sex, cp, thalach, oldpeak, slope, ca, thal, age_trestbps_ratio, chol_thalach_product, oldpeak_per_trestbps, age_chol_sum, trestbps, chol, exang`


### 7.3. Engineered Features Impact

* **`age_trestbps_ratio`** → Helped detect cases where blood pressure was abnormally high relative to age.
* **`chol_thalach_product`** → Captured combined effect of cholesterol and maximum heart rate.
* **`oldpeak_per_trestbps`** → Normalized ST depression with resting blood pressure, improving interpretability.
* **`age_chol_sum`** → A simple but effective cumulative indicator of overall health load.


### 7.4. Feature Engineering Results

| Stage                    | Shape     | Features Count | Example Features                                                                            |
| ------------------------ | --------- | -------------- | ------------------------------------------------------------------------------------------- |
| Raw Dataset              | (1025,13) | 13             | `age, trestbps, chol, thalach, oldpeak, slope, ca, thal`                                    |
| After Manual Engineering | (1025,17) | 17             | `age_trestbps_ratio, chol_thalach_product, oldpeak_per_trestbps, age_chol_sum`              |
| After Feature Selection  | (1025,15) | 15             | `age, cp, thalach, oldpeak, slope, ca, thal, age_trestbps_ratio, chol_thalach_product, ...` |


### 7.5. Processed Data Preview

| age | trestbps | chol | thalach | oldpeak | age_trestbps_ratio | chol_thalach_product | oldpeak_per_trestbps | age_chol_sum | target |
| --- | -------- | ---- | ------- | ------- | ------------------ | -------------------- | -------------------- | ------------ | ------ |
| 49  | 118      | 149  | 126     | 0.8     | 0.415              | 18774                | 0.0067               | 198          | 0      |
| 64  | 180      | 325  | 154     | 0.0     | 0.356              | 50050                | 0.0000               | 389          | 1      |
| 54  | 108      | 267  | 167     | 0.0     | 0.500              | 44589                | 0.0000               | 321          | 1      |
| 59  | 135      | 234  | 161     | 0.5     | 0.437              | 37674                | 0.0037               | 293          | 1      |
| 51  | 125      | 245  | 166     | 2.4     | 0.408              | 40670                | 0.0191               | 296          | 1      |


---

## 8. Model Training, Evaluation & Selection

The **Heart Disease dataset** was used to train, evaluate, and select the **best-performing classification model** using a modular pipeline. The pipeline allows integration of **custom models**, **custom metrics**, and automated selection based on performance.


### 8.1. Pipeline Configuration

The training pipeline was configured with:

* **Problem Type:** Classification
* **Target Column:** `target`
* **Custom Models:**

  * `Chebyshev Kernel Classifier` (n_neighbors=7, memory_decay=0.95)
* **Custom Metrics:**

  * `Balanced Gain` → Measures the product of sensitivity and specificity to handle class imbalance.
* **Selection Method:** Best performing model using top 3 metrics


### 8.2. Training Workflow

1. **Data Splitting**

   * Train/Test Split: 80% / 20%
   * **X_train:** 820 samples, 13 features
   * **X_test:** 205 samples, 13 features

2. **Model Training**

   * **Total Models Trained:** 14
   * **Custom Classifier:** Chebyshev Kernel Classifier trained with memory decay applied to historical samples.
   * **Rejected Models:** None explicitly (evaluated and filtered automatically based on metric performance).

3. **Evaluation Metrics**

   * Accuracy
   * AUC
   * Precision
   * Recall
   * F1-Score
   * **Balanced Gain** (custom metric)

### 8.3. Evaluation Summary

| Model                           | Accuracy | AUC      | Precision | Recall   | F1       | Balanced Gain |
| ------------------------------- | -------- | -------- | --------- | -------- | -------- | ------------- |
| Light Gradient Boosting Machine | 0.985366 | 0.990577 | 0.985784  | 0.985366 | 0.985364 | 0.970874      |
| Gradient Boosting Classifier    | 0.931707 | 0.980678 | 0.932353  | 0.931707 | 0.931675 | 0.867504      |
| Random Forest Classifier        | 0.985366 | 1.000000 | 0.985784  | 0.985366 | 0.985364 | 0.970874      |
| Extra Trees Classifier          | 0.985366 | 1.000000 | 0.985784  | 0.985366 | 0.985364 | 0.970874      |
| Logistic Regression             | 0.795122 | 0.876832 | 0.802344  | 0.795122 | 0.793787 | 0.625357      |
| Naïve Bayes                     | 0.800000 | 0.870550 | 0.810508  | 0.800000 | 0.798174 | 0.630497      |
| SVM – Linear Kernel             | 0.804878 | 0.871359 | 0.816776  | 0.804878 | 0.802907 | 0.637350      |
| Linear Discriminant Analysis    | 0.819512 | 0.881020 | 0.836284  | 0.819512 | 0.817109 | 0.657910      |
| Ridge Classifier                | 0.809756 | 0.500000 | 0.829157  | 0.809756 | 0.806765 | 0.639634      |
| Decision Tree Classifier        | 0.985366 | 0.985437 | 0.985784  | 0.985366 | 0.985364 | 0.970874      |
| K Neighbors Classifier          | 0.731707 | 0.860461 | 0.731717  | 0.731707 | 0.731695 | 0.535313      |
| Quadratic Discriminant Analysis | 0.814634 | 0.897582 | 0.817571  | 0.814634 | 0.814148 | 0.660765      |
| Ada Boost Classifier            | 0.878049 | 0.948506 | 0.878390  | 0.878049 | 0.878031 | 0.770893      |
| Chebyshev Kernel Classifier     | 0.712195 | 0.712022 | 0.713094  | 0.712195 | 0.711811 | 0.505711      |

* **Selected Model:** `Light Gradient Boosting Machine`
* **Selection Criteria:** Highest Balanced Gain and F1-Score


### 8.4. Training & Testing Data Overview

**X_train (820 samples):**

| age | sex | cp | trestbps | chol | fbs | restecg | thalach | exang | oldpeak | slope | ca | thal |
| --- | --- | -- | -------- | ---- | --- | ------- | ------- | ----- | ------- | ----- | -- | ---- |
| 49  | 1   | 2  | 118      | 149  | 0   | 0       | 126     | 0     | 0.8     | 2     | 3  | 2    |
| 64  | 0   | 0  | 180      | 325  | 0   | 1       | 154     | 1     | 0.0     | 2     | 0  | 2    |
| …   | …   | …  | …        | …    | …   | …       | …       | …     | …       | …     | …  | …    |

**X_test (205 samples):**

| age | sex | cp | trestbps | chol | fbs | restecg | thalach | exang | oldpeak | slope | ca | thal |
| --- | --- | -- | -------- | ---- | --- | ------- | ------- | ----- | ------- | ----- | -- | ---- |
| 62  | 0   | 0  | 124      | 209  | 0   | 1       | 163     | 0     | 0.0     | 2     | 0  | 2    |
| 53  | 0   | 2  | 128      | 216  | 0   | 0       | 115     | 0     | 0.0     | 2     | 0  | 0    |
| …   | …   | …  | …        | …    | …   | …       | …       | …     | …       | …     | …  | …    |

**Target Distribution:**

* Training (`y_train`): 526 positive, 294 negative
* Testing (`y_test`): 105 positive, 100 negative



### 9. **License**

This project is licensed under the [MIT License](LICENSE).




