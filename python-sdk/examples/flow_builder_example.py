"""
Flow builder example showing node-based verification flows.
"""

import asyncio
import os
from facesign import FaceSignClient
from facesign.utils import FlowBuilder
from facesign.models.nodes import (
    FSDocumentScanMode,
    FSDocumentType,
    FSFaceScanMode,
)


async def main():
    """Create a session with a custom flow."""
    
    # Initialize client
    api_key = os.getenv("FACESIGN_API_KEY", "sk_test_...")
    client = FaceSignClient(api_key=api_key)
    
    try:
        # Build a custom verification flow
        print("Building custom verification flow...")
        
        flow = (FlowBuilder()
            .add_start_node("start")
            .add_conversation_node(
                "greeting",
                "Hello! I'll help you verify your identity today. What's your name?",
                [{"id": "t1", "condition": "true"}]
            )
            .add_liveness_detection_node(
                "liveness_check",
                {
                    "livenessDetected": "document_scan",
                    "deepfakeDetected": "end_failed",
                    "noFace": "end_failed"
                }
            )
            .add_document_scan_node(
                "document_scan",
                FSDocumentScanMode.SINGLE_SIDE,
                [
                    FSDocumentType.PASSPORT,
                    FSDocumentType.IDENTITY_CARD,
                    FSDocumentType.DL
                ],
                {
                    "scanSuccess": "face_capture",
                    "userCancelled": "end_cancelled",
                    "scanTimeout": "end_timeout"
                }
            )
            .add_face_scan_node(
                "face_capture",
                FSFaceScanMode.COMPARE,
                {
                    "match": "final_conversation",
                    "noMatch": "end_failed",
                    "error": "end_failed"
                },
                reference_image_source="session",
                similarity_threshold=0.8,
                require_liveness=True
            )
            .add_conversation_node(
                "final_conversation",
                "Great! Your identity has been verified successfully. Thank you!",
                [{"id": "t2", "condition": "true"}]
            )
            .add_end_node("end_success")
            .add_end_node("end_failed")
            .add_end_node("end_cancelled")
            .add_end_node("end_timeout")
            
            # Connect the nodes with edges
            .connect("start", "greeting")
            .connect("greeting", "liveness_check")
            .connect("liveness_check", "document_scan")
            .connect("document_scan", "face_capture")
            .connect("face_capture", "final_conversation")
            .connect("final_conversation", "end_success")
            
            .build()
        )
        
        print(f"✅ Flow built with {len(flow.nodes)} nodes and {len(flow.edges)} edges")
        
        # Create session with the custom flow
        print("Creating session with custom flow...")
        session = await client.sessions.acreate(
            client_reference_id="python-flow-example-456",
            metadata={
                "source": "python-flow-builder-example",
                "flow_type": "liveness_document_face_compare",
                "environment": "development"
            },
            flow=flow,
            initial_phrase="Welcome to our advanced identity verification process!",
            final_phrase="Thank you for completing the verification!",
            default_lang="en",
            zone="es"
        )
        
        print(f"✅ Session created with custom flow!")
        print(f"Session ID: {session.session.id}")
        print(f"Status: {session.session.status}")
        print(f"Client Secret: {session.client_secret.secret}")
        print(f"Verification URL: {session.client_secret.url}")
        
        # Print flow summary
        print(f"\nFlow Summary:")
        print(f"  Nodes: {len(flow.nodes)}")
        for node in flow.nodes:
            print(f"    - {node.id} ({node.type})")
        print(f"  Edges: {len(flow.edges)}")
        for edge in flow.edges:
            print(f"    - {edge.source} → {edge.target}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())