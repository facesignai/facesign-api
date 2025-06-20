"""
Tests for the FlowBuilder utility.
"""

import pytest
from facesign.utils import FlowBuilder
from facesign.models.nodes import (
    FSDocumentScanMode,
    FSDocumentType,
    FSFaceScanMode,
)


class TestFlowBuilder:
    """Test cases for FlowBuilder."""
    
    def test_empty_builder(self):
        """Test empty flow builder initialization."""
        builder = FlowBuilder()
        assert len(builder.nodes) == 0
        assert len(builder.edges) == 0
    
    def test_simple_flow(self):
        """Test building a simple flow."""
        flow = (FlowBuilder()
            .add_start_node("start")
            .add_end_node("end")
            .connect("start", "end")
            .build()
        )
        
        assert len(flow.nodes) == 2
        assert len(flow.edges) == 1
        
        # Check nodes
        start_node = next(n for n in flow.nodes if n.id == "start")
        end_node = next(n for n in flow.nodes if n.id == "end")
        assert start_node.type == "start"
        assert end_node.type == "end"
        
        # Check edge
        edge = flow.edges[0]
        assert edge.source == "start"
        assert edge.target == "end"
    
    def test_complex_flow(self):
        """Test building a complex flow with multiple node types."""
        flow = (FlowBuilder()
            .add_start_node("start")
            .add_conversation_node(
                "greeting",
                "Hello!",
                [{"id": "t1", "condition": "true"}]
            )
            .add_liveness_detection_node(
                "liveness",
                {"livenessDetected": "document", "deepfakeDetected": "end"}
            )
            .add_document_scan_node(
                "document",
                FSDocumentScanMode.SINGLE_SIDE,
                [FSDocumentType.PASSPORT],
                {"scanSuccess": "end"}
            )
            .add_end_node("end")
            .connect("start", "greeting")
            .connect("greeting", "liveness")
            .connect("liveness", "document")
            .connect("document", "end")
            .build()
        )
        
        assert len(flow.nodes) == 5
        assert len(flow.edges) == 4
        
        # Verify node types
        node_types = {node.id: node.type for node in flow.nodes}
        assert node_types["start"] == "start"
        assert node_types["greeting"] == "conversation"
        assert node_types["liveness"] == "liveness_detection"
        assert node_types["document"] == "document_scan"
        assert node_types["end"] == "end"
    
    def test_flow_validation_no_nodes(self):
        """Test flow validation with no nodes."""
        builder = FlowBuilder()
        with pytest.raises(ValueError, match="Flow must have at least one node"):
            builder.build()
    
    def test_flow_validation_no_start(self):
        """Test flow validation with no start node."""
        builder = FlowBuilder()
        builder.add_end_node("end")
        with pytest.raises(ValueError, match="Flow must have at least one START node"):
            builder.build()
    
    def test_flow_validation_no_end(self):
        """Test flow validation with no end node."""
        builder = FlowBuilder()
        builder.add_start_node("start")
        with pytest.raises(ValueError, match="Flow must have at least one END node"):
            builder.build()
    
    def test_flow_validation_invalid_edge(self):
        """Test flow validation with invalid edge reference."""
        builder = FlowBuilder()
        builder.add_start_node("start")
        builder.add_end_node("end")
        builder.connect("start", "nonexistent")
        
        with pytest.raises(ValueError, match="Edge target 'nonexistent' not found"):
            builder.build()
    
    def test_builder_reset(self):
        """Test builder reset functionality."""
        builder = FlowBuilder()
        builder.add_start_node("start")
        builder.add_end_node("end")
        builder.connect("start", "end")
        
        assert len(builder.nodes) == 2
        assert len(builder.edges) == 1
        
        builder.reset()
        assert len(builder.nodes) == 0
        assert len(builder.edges) == 0
        assert builder._edge_counter == 0
    
    def test_fluent_interface(self):
        """Test that all methods return builder instance for chaining."""
        builder = FlowBuilder()
        
        result = (builder
            .add_start_node("start")
            .add_end_node("end")
            .connect("start", "end")
            .reset()
        )
        
        assert result is builder