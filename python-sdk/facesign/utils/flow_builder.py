"""
Flow builder utility for creating node-based verification flows.
"""

from typing import List, Dict, Optional, Any
from ..models.nodes import (
    FSFlow,
    FSNode,
    FSEdge,
    FSStartNode,
    FSEndNode,
    FSConversationNode,
    FSLivenessDetectionNode,
    FSEnterEmailNode,
    FSDataValidationNode,
    FSDocumentScanNode,
    FSRecognitionNode,
    FSFaceScanNode,
    FSTwoFactorNode,
    FSNodeTransition,
    FSDocumentType,
    FSDocumentScanMode,
    FSFaceScanMode,
    FSTwoFactorChannel,
    FSTwoFactorContactSource,
)


class FlowBuilder:
    """
    Builder class for creating FaceSign verification flows.
    
    Provides a fluent interface for constructing flows with nodes and edges.
    """
    
    def __init__(self):
        """Initialize empty flow builder."""
        self.nodes: List[FSNode] = []
        self.edges: List[FSEdge] = []
        self._edge_counter = 0
    
    def _generate_edge_id(self) -> str:
        """Generate unique edge ID."""
        self._edge_counter += 1
        return f"edge_{self._edge_counter}"
    
    def add_start_node(self, node_id: str) -> "FlowBuilder":
        """
        Add a START node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            
        Returns:
            FlowBuilder instance for chaining
        """
        node = FSStartNode(id=node_id)
        self.nodes.append(node)
        return self
    
    def add_end_node(self, node_id: str) -> "FlowBuilder":
        """
        Add an END node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            
        Returns:
            FlowBuilder instance for chaining
        """
        node = FSEndNode(id=node_id)
        self.nodes.append(node)
        return self
    
    def add_conversation_node(
        self,
        node_id: str,
        prompt: str,
        transitions: List[Dict[str, str]],
    ) -> "FlowBuilder":
        """
        Add a CONVERSATION node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            prompt: The conversation prompt for the AI
            transitions: List of transition conditions
            
        Returns:
            FlowBuilder instance for chaining
            
        Example:
            >>> builder.add_conversation_node(
            ...     "greeting",
            ...     "Hello! What's your name?",
            ...     [{"id": "t1", "condition": "true"}]
            ... )
        """
        node_transitions = [
            FSNodeTransition(id=t["id"], condition=t["condition"])
            for t in transitions
        ]
        node = FSConversationNode(
            id=node_id,
            prompt=prompt,
            transitions=node_transitions
        )
        self.nodes.append(node)
        return self
    
    def add_liveness_detection_node(
        self,
        node_id: str,
        outcomes: Dict[str, str],
    ) -> "FlowBuilder":
        """
        Add a LIVENESS_DETECTION node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            outcomes: Mapping of outcomes to target node IDs
            
        Returns:
            FlowBuilder instance for chaining
            
        Example:
            >>> builder.add_liveness_detection_node(
            ...     "liveness",
            ...     {
            ...         "livenessDetected": "document", 
            ...         "deepfakeDetected": "end"
            ...     }
            ... )
        """
        node = FSLivenessDetectionNode(id=node_id, outcomes=outcomes)
        self.nodes.append(node)
        return self
    
    def add_document_scan_node(
        self,
        node_id: str,
        scanning_mode: FSDocumentScanMode,
        allowed_document_types: List[FSDocumentType],
        outcomes: Dict[str, str],
        show_torch_button: Optional[bool] = True,
        show_camera_switch: Optional[bool] = True,
    ) -> "FlowBuilder":
        """
        Add a DOCUMENT_SCAN node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            scanning_mode: Document scanning mode
            allowed_document_types: List of allowed document types
            outcomes: Mapping of outcomes to target node IDs
            show_torch_button: Whether to show torch button
            show_camera_switch: Whether to show camera switch button
            
        Returns:
            FlowBuilder instance for chaining
            
        Example:
            >>> from facesign.models.nodes import FSDocumentScanMode, FSDocumentType
            >>> builder.add_document_scan_node(
            ...     "document",
            ...     FSDocumentScanMode.SINGLE_SIDE,
            ...     [FSDocumentType.PASSPORT, FSDocumentType.IDENTITY_CARD],
            ...     {"scanSuccess": "end", "userCancelled": "end"}
            ... )
        """
        node = FSDocumentScanNode(
            id=node_id,
            scanning_mode=scanning_mode,
            allowed_document_types=allowed_document_types,
            outcomes=outcomes,
            show_torch_button=show_torch_button,
            show_camera_switch=show_camera_switch,
        )
        self.nodes.append(node)
        return self
    
    def add_face_scan_node(
        self,
        node_id: str,
        mode: FSFaceScanMode,
        outcomes: Dict[str, str],
        **kwargs,
    ) -> "FlowBuilder":
        """
        Add a FACE_SCAN node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            mode: Face scanning mode (capture or compare)
            outcomes: Mapping of outcomes to target node IDs
            **kwargs: Additional face scan configuration
            
        Returns:
            FlowBuilder instance for chaining
            
        Example:
            >>> from facesign.models.nodes import FSFaceScanMode
            >>> builder.add_face_scan_node(
            ...     "face_capture",
            ...     FSFaceScanMode.CAPTURE,
            ...     {"captured": "end", "error": "end"},
            ...     require_liveness=True
            ... )
        """
        node = FSFaceScanNode(
            id=node_id,
            mode=mode,
            outcomes=outcomes,
            **kwargs
        )
        self.nodes.append(node)
        return self
    
    def add_recognition_node(
        self,
        node_id: str,
        outcomes: Dict[str, str],
    ) -> "FlowBuilder":
        """
        Add a RECOGNITION node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            outcomes: Mapping of outcomes to target node IDs
            
        Returns:
            FlowBuilder instance for chaining
        """
        node = FSRecognitionNode(id=node_id, outcomes=outcomes)
        self.nodes.append(node)
        return self
    
    def add_two_factor_node(
        self,
        node_id: str,
        channels: List[FSTwoFactorChannel],
        contact_source: FSTwoFactorContactSource,
        outcomes: Dict[str, str],
        **kwargs,
    ) -> "FlowBuilder":
        """
        Add a TWO_FACTOR node to the flow.
        
        Args:
            node_id: Unique identifier for the node
            channels: List of 2FA channels (email, sms)
            contact_source: Source for contact information
            outcomes: Mapping of outcomes to target node IDs
            **kwargs: Additional 2FA configuration
            
        Returns:
            FlowBuilder instance for chaining
        """
        node = FSTwoFactorNode(
            id=node_id,
            channels=channels,
            contact_source=contact_source,
            outcomes=outcomes,
            **kwargs
        )
        self.nodes.append(node)
        return self
    
    def add_edge(self, source_id: str, target_id: str, edge_id: Optional[str] = None) -> "FlowBuilder":
        """
        Add an edge connecting two nodes.
        
        Args:
            source_id: Source node ID
            target_id: Target node ID
            edge_id: Optional custom edge ID (auto-generated if not provided)
            
        Returns:
            FlowBuilder instance for chaining
        """
        if edge_id is None:
            edge_id = self._generate_edge_id()
        
        edge = FSEdge(id=edge_id, source=source_id, target=target_id)
        self.edges.append(edge)
        return self
    
    def connect(self, source_id: str, target_id: str) -> "FlowBuilder":
        """
        Convenience method for adding an edge.
        
        Args:
            source_id: Source node ID
            target_id: Target node ID
            
        Returns:
            FlowBuilder instance for chaining
        """
        return self.add_edge(source_id, target_id)
    
    def build(self) -> FSFlow:
        """
        Build the complete flow.
        
        Returns:
            FSFlow object with all nodes and edges
            
        Raises:
            ValueError: If flow validation fails
        """
        if not self.nodes:
            raise ValueError("Flow must have at least one node")
        
        # Basic validation
        start_nodes = [n for n in self.nodes if n.type == "start"]
        end_nodes = [n for n in self.nodes if n.type == "end"]
        
        if not start_nodes:
            raise ValueError("Flow must have at least one START node")
        if not end_nodes:
            raise ValueError("Flow must have at least one END node")
        
        # Validate edge references
        node_ids = {node.id for node in self.nodes}
        for edge in self.edges:
            if edge.source not in node_ids:
                raise ValueError(f"Edge source '{edge.source}' not found in nodes")
            if edge.target not in node_ids:
                raise ValueError(f"Edge target '{edge.target}' not found in nodes")
        
        return FSFlow(nodes=self.nodes, edges=self.edges)
    
    def reset(self) -> "FlowBuilder":
        """
        Reset the builder to empty state.
        
        Returns:
            FlowBuilder instance for chaining
        """
        self.nodes = []
        self.edges = []
        self._edge_counter = 0
        return self