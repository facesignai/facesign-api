#!/usr/bin/env python3
"""
Comprehensive test script for FaceSign Python SDK.

This script tests all SDK functionality against the live API using the provided test key.
"""

import asyncio
import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

# Add the parent directory to the path to import facesign
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from facesign import (
        FaceSignClient,
        AsyncFaceSignClient,
        FaceSignError,
        FaceSignAPIError,
        AuthenticationError,
        ValidationError,
        Session,
        SessionSettings,
        CreateSessionResponse,
    )
    print("✅ Successfully imported FaceSign SDK")
except ImportError as e:
    print(f"❌ Failed to import FaceSign SDK: {e}")
    sys.exit(1)

# Test configuration - using environment variables for security
API_KEY = os.getenv("FACESIGN_DEV_API_KEY", "your_dev_api_key_here")
SERVER_URL = os.getenv("FACESIGN_DEV_SERVER_URL", "https://api.dev.facesign.ai")
TEST_RESULTS: Dict[str, Any] = {
    "test_name": "FaceSign Python SDK Comprehensive Test",
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "api_key": API_KEY[:10] + "..." if len(API_KEY) > 10 else "configured",
    "server_url": SERVER_URL,
    "tests": [],
    "summary": {
        "total": 0,
        "passed": 0,
        "failed": 0,
        "errors": []
    }
}

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TestResult:
    """Container for test results."""
    
    def __init__(self, name: str):
        self.name = name
        self.passed = False
        self.error = None
        self.details = {}
        self.start_time = time.time()
        self.end_time = None
    
    def success(self, details: Optional[Dict[str, Any]] = None):
        """Mark test as successful."""
        self.passed = True
        self.end_time = time.time()
        if details:
            self.details.update(details)
    
    def failure(self, error: Exception, details: Optional[Dict[str, Any]] = None):
        """Mark test as failed."""
        self.passed = False
        self.error = str(error)
        self.end_time = time.time()
        if details:
            self.details.update(details)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return {
            "name": self.name,
            "passed": self.passed,
            "error": self.error,
            "details": self.details,
            "duration": self.end_time - self.start_time if self.end_time else None
        }


def log_test_result(result: TestResult):
    """Log and record test result."""
    status = "✅ PASS" if result.passed else "❌ FAIL"
    duration = f"{result.end_time - result.start_time:.2f}s" if result.end_time else "N/A"
    
    print(f"{status} | {result.name} ({duration})")
    if result.error:
        print(f"    Error: {result.error}")
    if result.details:
        print(f"    Details: {json.dumps(result.details, indent=2)}")
    
    TEST_RESULTS["tests"].append(result.to_dict())
    TEST_RESULTS["summary"]["total"] += 1
    if result.passed:
        TEST_RESULTS["summary"]["passed"] += 1
    else:
        TEST_RESULTS["summary"]["failed"] += 1
        TEST_RESULTS["summary"]["errors"].append({
            "test": result.name,
            "error": result.error
        })


def test_client_initialization():
    """Test FaceSign client initialization with different configurations."""
    
    # Test 1: Dev environment initialization
    result = TestResult("Client Initialization - Dev Environment")
    try:
        client = FaceSignClient(API_KEY, server_url=SERVER_URL)
        assert client.api_key == API_KEY
        assert client.server_url == SERVER_URL
        assert client.timeout == 10.0
        result.success({
            "api_key": client.api_key[:10] + "...",
            "server_url": client.server_url,
            "timeout": client.timeout
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Custom server URL and timeout
    result = TestResult("Client Initialization - Custom Config")
    try:
        client = FaceSignClient(
            API_KEY,
            server_url="https://api.facesign.ai/",  # Test trailing slash handling
            timeout=30.0,
            log_level="DEBUG"
        )
        assert client.server_url == "https://api.facesign.ai"  # Should strip trailing slash
        assert client.timeout == 30.0
        result.success({
            "server_url": client.server_url,
            "timeout": client.timeout
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 3: AsyncFaceSignClient initialization
    result = TestResult("AsyncClient Initialization")
    try:
        async_client = AsyncFaceSignClient(API_KEY)
        assert async_client.api_key == API_KEY
        result.success({
            "api_key": async_client.api_key[:10] + "...",
            "server_url": async_client.server_url
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)


def test_languages_api():
    """Test languages API endpoints."""
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    
    # Test 1: Get supported languages
    result = TestResult("Languages API - Get Languages")
    try:
        languages = client.languages.get()
        assert hasattr(languages, 'langs')
        assert isinstance(languages.langs, list)
        assert len(languages.langs) > 0
        
        # Check structure of first language
        first_lang = languages.langs[0]
        assert hasattr(first_lang, 'id')
        assert hasattr(first_lang, 'title')
        
        result.success({
            "languages_count": len(languages.langs),
            "sample_languages": [
                {"id": lang.id, "title": lang.title} 
                for lang in languages.langs[:3]
            ]
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Alias method (retrieve)
    result = TestResult("Languages API - Retrieve Alias")
    try:
        languages = client.languages.retrieve()
        assert hasattr(languages, 'langs')
        assert len(languages.langs) > 0
        result.success({"languages_count": len(languages.langs)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)


def test_avatars_api():
    """Test avatars API endpoints."""
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    
    # Test 1: Get available avatars
    result = TestResult("Avatars API - Get Avatars")
    try:
        avatars = client.avatars.get()
        assert hasattr(avatars, 'avatars')
        assert isinstance(avatars.avatars, list)
        assert len(avatars.avatars) > 0
        
        # Check structure of first avatar
        first_avatar = avatars.avatars[0]
        assert hasattr(first_avatar, 'id')
        assert hasattr(first_avatar, 'name')
        
        result.success({
            "avatars_count": len(avatars.avatars),
            "sample_avatars": [
                {
                    "id": avatar.id,
                    "name": avatar.name,
                    "gender": getattr(avatar, 'gender', 'unknown')
                } 
                for avatar in avatars.avatars[:3]
            ]
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Alias method (retrieve)
    result = TestResult("Avatars API - Retrieve Alias")
    try:
        avatars = client.avatars.retrieve()
        assert hasattr(avatars, 'avatars')
        assert len(avatars.avatars) > 0
        result.success({"avatars_count": len(avatars.avatars)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)


def test_sessions_api():
    """Test sessions API endpoints."""
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    created_session_id = None
    
    # Test 1: Create session with modules (legacy)
    result = TestResult("Sessions API - Create Session (Modules)")
    try:
        session_response = client.sessions.create(
            client_reference_id=f"test-{int(time.time())}",
            metadata={"test": "python-sdk", "timestamp": int(time.time())},
            modules=[{"type": "identityVerification"}]
        )
        
        assert isinstance(session_response, CreateSessionResponse)
        assert hasattr(session_response, 'session')
        assert hasattr(session_response, 'client_secret')
        assert session_response.session.id.startswith('vs_')
        assert session_response.client_secret.secret.startswith('cs_')
        
        created_session_id = session_response.session.id
        
        result.success({
            "session_id": session_response.session.id,
            "client_secret": session_response.client_secret.secret[:10] + "...",
            "status": session_response.session.status
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Create session with flow
    result = TestResult("Sessions API - Create Session (Flow)")
    try:
        flow_session = client.sessions.create(
            client_reference_id=f"flow-test-{int(time.time())}",
            metadata={"test": "python-sdk-flow", "timestamp": int(time.time())},
            flow={
                "nodes": [
                    {
                        "id": "start",
                        "type": "identityVerification",
                        "data": {}
                    }
                ],
                "edges": []
            }
        )
        
        assert isinstance(flow_session, CreateSessionResponse)
        assert flow_session.session.id.startswith('vs_')
        
        result.success({
            "session_id": flow_session.session.id,
            "status": flow_session.session.status
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 3: Retrieve session
    if created_session_id:
        result = TestResult("Sessions API - Retrieve Session")
        try:
            retrieved_session = client.sessions.retrieve(created_session_id)
            assert isinstance(retrieved_session, type(session_response))
            assert retrieved_session.session.id == created_session_id
            
            result.success({
                "session_id": retrieved_session.session.id,
                "status": retrieved_session.session.status,
                "has_report": retrieved_session.session.report is not None
            })
        except Exception as e:
            result.failure(e)
        log_test_result(result)
    
    # Test 4: List sessions
    result = TestResult("Sessions API - List Sessions")
    try:
        sessions_list = client.sessions.list(limit=5, sort_by="createdAt", sort_order="desc")
        assert hasattr(sessions_list, 'sessions')
        assert isinstance(sessions_list.sessions, list)
        assert len(sessions_list.sessions) > 0
        
        result.success({
            "sessions_count": len(sessions_list.sessions),
            "has_pagination": hasattr(sessions_list, 'pagination'),
            "sample_sessions": [
                {
                    "id": session.id,
                    "status": session.status,
                    "created_at": getattr(session, 'created_at', None)
                }
                for session in sessions_list.sessions[:3]
            ]
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 5: Refresh client secret
    if created_session_id:
        result = TestResult("Sessions API - Refresh Client Secret")
        try:
            new_secret = client.sessions.refresh_client_secret(created_session_id)
            assert hasattr(new_secret, 'secret')
            assert new_secret.secret.startswith('cs_')
            
            result.success({
                "new_secret": new_secret.secret[:10] + "...",
                "expires_at": getattr(new_secret, 'expire_at', None)
            })
        except Exception as e:
            result.failure(e)
        log_test_result(result)
    
    return created_session_id


def test_error_handling():
    """Test error handling scenarios."""
    
    # Test 1: Invalid API key
    result = TestResult("Error Handling - Invalid API Key")
    try:
        client = FaceSignClient("invalid_key", server_url=SERVER_URL)
        try:
            client.languages.get()
            result.failure(Exception("Expected authentication error"))
        except AuthenticationError:
            result.success({"error_type": "AuthenticationError"})
        except FaceSignAPIError as e:
            # Some APIs might return different error types
            result.success({"error_type": type(e).__name__, "message": str(e)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Invalid session ID
    result = TestResult("Error Handling - Invalid Session ID")
    try:
        client = FaceSignClient(API_KEY, server_url=SERVER_URL)
        try:
            client.sessions.retrieve("invalid_session_id")
            result.failure(Exception("Expected not found error"))
        except FaceSignAPIError as e:
            result.success({"error_type": type(e).__name__, "message": str(e)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 3: Invalid session creation data
    result = TestResult("Error Handling - Invalid Session Data")
    try:
        client = FaceSignClient(API_KEY, server_url=SERVER_URL)
        try:
            # Try to create session with invalid data
            client.sessions.create(
                modules=[{"type": "invalid_module_type"}]
            )
            result.failure(Exception("Expected validation error"))
        except (ValidationError, FaceSignAPIError) as e:
            result.success({"error_type": type(e).__name__, "message": str(e)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)


async def test_async_functionality():
    """Test asynchronous functionality."""
    
    # Test 1: Async languages
    result = TestResult("Async API - Languages")
    try:
        async with AsyncFaceSignClient(API_KEY, server_url=SERVER_URL) as client:
            languages = await client.languages.aget()
            assert hasattr(languages, 'langs')
            assert len(languages.langs) > 0
            
            result.success({"languages_count": len(languages.langs)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Async avatars
    result = TestResult("Async API - Avatars")
    try:
        async with AsyncFaceSignClient(API_KEY, server_url=SERVER_URL) as client:
            avatars = await client.avatars.aget()
            assert hasattr(avatars, 'avatars')
            assert len(avatars.avatars) > 0
            
            result.success({"avatars_count": len(avatars.avatars)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 3: Async session creation
    result = TestResult("Async API - Create Session")
    try:
        async with AsyncFaceSignClient(API_KEY, server_url=SERVER_URL) as client:
            session_response = await client.sessions.acreate(
                client_reference_id=f"async-test-{int(time.time())}",
                metadata={"test": "async-python-sdk"},
                modules=[{"type": "identityVerification"}]
            )
            
            assert session_response.session.id.startswith('vs_')
            
            result.success({
                "session_id": session_response.session.id,
                "status": session_response.session.status
            })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 4: Async session list
    result = TestResult("Async API - List Sessions")
    try:
        async with AsyncFaceSignClient(API_KEY, server_url=SERVER_URL) as client:
            sessions_list = await client.sessions.alist(limit=3)
            assert len(sessions_list.sessions) > 0
            
            result.success({"sessions_count": len(sessions_list.sessions)})
    except Exception as e:
        result.failure(e)
    log_test_result(result)


def test_model_validation():
    """Test Pydantic model validation."""
    
    # Test 1: SessionSettings validation
    result = TestResult("Model Validation - SessionSettings")
    try:
        # Valid settings
        settings = SessionSettings(
            client_reference_id="test-123",
            metadata={"key": "value"},
            modules=[{"type": "identityVerification"}]
        )
        assert settings.client_reference_id == "test-123"
        assert settings.metadata == {"key": "value"}
        
        result.success({
            "client_reference_id": settings.client_reference_id,
            "has_metadata": settings.metadata is not None,
            "modules_count": len(settings.modules) if settings.modules else 0
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Flow validation
    result = TestResult("Model Validation - Flow Structure")
    try:
        settings = SessionSettings(
            flow={
                "nodes": [
                    {
                        "id": "start",
                        "type": "identityVerification",
                        "data": {}
                    }
                ],
                "edges": []
            }
        )
        assert settings.flow is not None
        assert "nodes" in settings.flow
        assert "edges" in settings.flow
        
        result.success({
            "has_flow": settings.flow is not None,
            "nodes_count": len(settings.flow.get("nodes", [])),
            "edges_count": len(settings.flow.get("edges", []))
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)


def test_performance_benchmarks():
    """Test performance benchmarks for API calls."""
    client = FaceSignClient(API_KEY, server_url=SERVER_URL)
    
    # Test 1: Languages API performance
    result = TestResult("Performance - Languages API")
    try:
        start_time = time.time()
        for _ in range(3):
            client.languages.get()
        avg_time = (time.time() - start_time) / 3
        
        result.success({
            "average_response_time": f"{avg_time:.3f}s",
            "calls_made": 3
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)
    
    # Test 2: Session creation performance
    result = TestResult("Performance - Session Creation")
    try:
        start_time = time.time()
        session_response = client.sessions.create(
            client_reference_id=f"perf-test-{int(time.time())}",
            modules=[{"type": "identityVerification"}]
        )
        creation_time = time.time() - start_time
        
        result.success({
            "creation_time": f"{creation_time:.3f}s",
            "session_id": session_response.session.id
        })
    except Exception as e:
        result.failure(e)
    log_test_result(result)


def save_test_results():
    """Save test results to a JSON file."""
    try:
        with open("test_results.json", "w") as f:
            json.dump(TEST_RESULTS, f, indent=2)
        print(f"\n📊 Test results saved to: test_results.json")
    except Exception as e:
        print(f"❌ Failed to save test results: {e}")


def print_summary():
    """Print test summary."""
    summary = TEST_RESULTS["summary"]
    print(f"\n" + "="*50)
    print(f"🧪 TEST SUMMARY")
    print(f"="*50)
    print(f"Total Tests: {summary['total']}")
    print(f"Passed: {summary['passed']} ✅")
    print(f"Failed: {summary['failed']} ❌")
    print(f"Success Rate: {(summary['passed']/summary['total']*100):.1f}%" if summary['total'] > 0 else "N/A")
    
    if summary['errors']:
        print(f"\n❌ FAILED TESTS:")
        for error in summary['errors']:
            print(f"  • {error['test']}: {error['error']}")
    
    print(f"\n📊 Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


async def main():
    """Run all tests."""
    print("🚀 Starting FaceSign Python SDK Comprehensive Test")
    print(f"🔑 API Key: {API_KEY}")
    print(f"🌐 Server URL: {SERVER_URL}")
    print(f"📅 Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # Run synchronous tests
    print("\n📋 Running Synchronous Tests...")
    test_client_initialization()
    test_languages_api()
    test_avatars_api()
    test_sessions_api()
    test_error_handling()
    test_model_validation()
    test_performance_benchmarks()
    
    # Run asynchronous tests
    print("\n🔄 Running Asynchronous Tests...")
    await test_async_functionality()
    
    # Save results and print summary
    save_test_results()
    print_summary()
    
    # Exit with appropriate code
    exit_code = 0 if TEST_RESULTS["summary"]["failed"] == 0 else 1
    print(f"\n🏁 Test completed with exit code: {exit_code}")
    return exit_code


if __name__ == "__main__":
    try:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n⏹️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)