"""
Simple test script to verify CRUD system functionality
"""
import sys
import os

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from db.database import initialize_database, get_db
from db.schema import ProblemType, BlockType
from db.models import workflow, block_type, data_ingestion
from controllers.workflow_controller import WorkflowController
from schemas.workflow import WorkflowCreate


def test_crud_system():
    """Test basic CRUD functionality"""
    print("🧪 Testing CRUD System...")
    
    try:
        # Initialize database
        initialize_database()
        print("✅ Database initialized")
        
        # Get database session
        db_gen = get_db()
        db = next(db_gen)
        
        # Test workflow creation
        print("📝 Testing workflow creation...")
        workflow_data = WorkflowCreate(
            name="Test Workflow",
            description="A test workflow for CRUD validation",
            problem_type=ProblemType.CLASSIFICATION
        )
        
        created_workflow = WorkflowController.create_workflow(db, workflow_data)
        print(f"✅ Workflow created with ID: {created_workflow.id}")
        
        # Test workflow retrieval
        print("🔍 Testing workflow retrieval...")
        retrieved_workflow = WorkflowController.get_workflow(db, created_workflow.id)
        print(f"✅ Workflow retrieved: {retrieved_workflow.name}")
        
        # Test workflow listing
        print("📋 Testing workflow listing...")
        workflows = WorkflowController.get_workflows(db, skip=0, limit=10)
        print(f"✅ Found {len(workflows)} workflows")
        
        # Test workflow counting
        print("🔢 Testing workflow counting...")
        count = WorkflowController.count_workflows(db)
        print(f"✅ Total workflows: {count}")
        
        # Test workflow update
        print("✏️ Testing workflow update...")
        from schemas.workflow import WorkflowUpdate
        update_data = WorkflowUpdate(description="Updated test workflow description")
        updated_workflow = WorkflowController.update_workflow(db, created_workflow.id, update_data)
        print(f"✅ Workflow updated: {updated_workflow.description}")
        
        # Test workflow deletion
        print("🗑️ Testing workflow deletion...")
        delete_result = WorkflowController.delete_workflow(db, created_workflow.id)
        print(f"✅ Workflow deleted: {delete_result['message']}")
        
        # Test data ingestion config creation
        print("📊 Testing data ingestion config creation...")
        from schemas.data_ingestion import DataIngestionCreate
        from controllers.data_ingestion_controller import DataIngestionController
        
        ingestion_data = DataIngestionCreate(
            name="Test Data Ingestion",
            description="Test data ingestion configuration",
            file_type="csv",
            file_path="/test/data.csv"
        )
        
        created_config = DataIngestionController.create_config(db, ingestion_data)
        print(f"✅ Data ingestion config created with ID: {created_config.id}")
        
        # Test config retrieval
        retrieved_config = DataIngestionController.get_config(db, created_config.id)
        print(f"✅ Config retrieved: {retrieved_config.name}")
        
        # Test config deletion
        delete_result = DataIngestionController.delete_config(db, created_config.id)
        print(f"✅ Config deleted: {delete_result['message']}")
        
        print("🎉 All CRUD tests passed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        # Close database session
        try:
            db.close()
        except:
            pass


if __name__ == "__main__":
    test_crud_system()
