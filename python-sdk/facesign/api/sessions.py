"""
Sessions API implementation.
"""

from typing import Optional, Dict, Any, List, Union

from ..models.sessions import (
    SessionSettings,
    CreateSessionResponse,
    GetSessionResponse,
    GetSessionsResponse,
)
from ..models.common import ClientSecret


class SessionsAPI:
    """Sessions API client."""
    
    def __init__(self, client):
        """Initialize with parent client."""
        self.client = client
    
    def create(self, **kwargs) -> CreateSessionResponse:
        """
        Create a new verification session.
        
        Args:
            client_reference_id: Your internal reference ID for this session
            metadata: Custom metadata for the session
            modules: Legacy modules array (deprecated, use flow instead)
            flow: Node-based flow definition (recommended)
            initial_phrase: Custom greeting message for AI avatar
            final_phrase: Custom closing message for AI avatar
            provided_data: Pre-filled user data
            avatar_id: Specific avatar to use
            langs: Available languages for the session
            default_lang: Default language code
            zone: Geographic zone ('es' or 'eu')
            customization: UI/UX customization options
            
        Returns:
            CreateSessionResponse with session and client_secret
            
        Example:
            >>> session = client.sessions.create(
            ...     client_reference_id="user-123",
            ...     metadata={"source": "python-sdk"},
            ...     modules=[{"type": "identityVerification"}]
            ... )
            >>> print(session.session.id)
            >>> print(session.client_secret.secret)
        """
        settings = SessionSettings(**kwargs)
        response_data = self.client.request("POST", "/sessions", data=settings.model_dump())
        
        # Transform API response to match model expectations
        if "clientSecret" in response_data:
            response_data["client_secret"] = response_data.pop("clientSecret")
        
        return CreateSessionResponse(**response_data)
    
    async def acreate(self, **kwargs) -> CreateSessionResponse:
        """Async version of create()."""
        settings = SessionSettings(**kwargs)
        response_data = await self.client.arequest("POST", "/sessions", data=settings.model_dump())
        
        # Transform API response to match model expectations
        if "clientSecret" in response_data:
            response_data["client_secret"] = response_data.pop("clientSecret")
        
        return CreateSessionResponse(**response_data)
    
    def retrieve(self, session_id: str) -> GetSessionResponse:
        """
        Retrieve a specific session by ID.
        
        Args:
            session_id: The session ID to retrieve
            
        Returns:
            GetSessionResponse with session details and client_secret
            
        Example:
            >>> session = client.sessions.retrieve("vs_1a2b3c4d5e6f")
            >>> print(session.session.status)
            >>> print(session.session.report.is_verified if session.session.report else "No report yet")
        """
        response_data = self.client.request("GET", f"/sessions/{session_id}")
        
        # Transform API response to match model expectations
        if "clientSecret" in response_data:
            response_data["client_secret"] = response_data.pop("clientSecret")
        
        return GetSessionResponse(**response_data)
    
    async def aretrieve(self, session_id: str) -> GetSessionResponse:
        """Async version of retrieve()."""
        response_data = await self.client.arequest("GET", f"/sessions/{session_id}")
        
        # Transform API response to match model expectations
        if "clientSecret" in response_data:
            response_data["client_secret"] = response_data.pop("clientSecret")
        
        return GetSessionResponse(**response_data)
    
    def list(
        self,
        limit: Optional[int] = None,
        cursor: Optional[str] = None,
        flow_id: Optional[str] = None,
        client_reference_id: Optional[str] = None,
        status: Optional[Union[str, List[str]]] = None,
        from_date: Optional[int] = None,
        to_date: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        search: Optional[str] = None,
        include_total: Optional[bool] = None,
    ) -> GetSessionsResponse:
        """
        List sessions with optional filtering and pagination.
        
        Args:
            limit: Maximum number of sessions to return (max 100)
            cursor: Cursor for pagination
            flow_id: Filter by flow/form ID
            client_reference_id: Filter by client reference ID
            status: Filter by session status(es)
            from_date: Filter sessions created after this timestamp
            to_date: Filter sessions created before this timestamp
            sort_by: Field to sort by ('createdAt', 'status', 'finishedAt')
            sort_order: Sort order ('asc' or 'desc')
            search: Search in metadata and other fields
            include_total: Include total count (expensive operation)
            
        Returns:
            GetSessionsResponse with sessions list and pagination info
            
        Example:
            >>> sessions = client.sessions.list(
            ...     status="complete",
            ...     limit=10,
            ...     sort_by="createdAt",
            ...     sort_order="desc"
            ... )
            >>> for session in sessions.sessions:
            ...     print(f"{session.id}: {session.status}")
        """
        params = {}
        if limit is not None:
            params["limit"] = limit
        if cursor:
            params["cursor"] = cursor
        if flow_id:
            params["flowId"] = flow_id
        if client_reference_id:
            params["clientReferenceId"] = client_reference_id
        if status:
            params["status"] = status
        if from_date is not None:
            params["fromDate"] = from_date
        if to_date is not None:
            params["toDate"] = to_date
        if sort_by:
            params["sortBy"] = sort_by
        if sort_order:
            params["sortOrder"] = sort_order
        if search:
            params["search"] = search
        if include_total is not None:
            params["includeTotal"] = include_total
        
        response_data = self.client.request("GET", "/sessions", params=params)
        return GetSessionsResponse(**response_data)
    
    async def alist(
        self,
        limit: Optional[int] = None,
        cursor: Optional[str] = None,
        flow_id: Optional[str] = None,
        client_reference_id: Optional[str] = None,
        status: Optional[Union[str, List[str]]] = None,
        from_date: Optional[int] = None,
        to_date: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        search: Optional[str] = None,
        include_total: Optional[bool] = None,
    ) -> GetSessionsResponse:
        """Async version of list()."""
        params = {}
        if limit is not None:
            params["limit"] = limit
        if cursor:
            params["cursor"] = cursor
        if flow_id:
            params["flowId"] = flow_id
        if client_reference_id:
            params["clientReferenceId"] = client_reference_id
        if status:
            params["status"] = status
        if from_date is not None:
            params["fromDate"] = from_date
        if to_date is not None:
            params["toDate"] = to_date
        if sort_by:
            params["sortBy"] = sort_by
        if sort_order:
            params["sortOrder"] = sort_order
        if search:
            params["search"] = search
        if include_total is not None:
            params["includeTotal"] = include_total
        
        response_data = await self.client.arequest("GET", "/sessions", params=params)
        return GetSessionsResponse(**response_data)
    
    def refresh_client_secret(self, session_id: str) -> ClientSecret:
        """
        Generate a new client secret for a session.
        
        Args:
            session_id: The session ID to refresh
            
        Returns:
            New ClientSecret object
            
        Note:
            This invalidates the previous client secret immediately.
            
        Example:
            >>> new_secret = client.sessions.refresh_client_secret("vs_1a2b3c4d5e6f")
            >>> print(new_secret.secret)
            >>> print(f"Expires at: {new_secret.expire_at}")
        """
        response_data = self.client.request("GET", f"/sessions/{session_id}/refresh")
        return ClientSecret(**response_data)
    
    async def arefresh_client_secret(self, session_id: str) -> ClientSecret:
        """Async version of refresh_client_secret()."""
        response_data = await self.client.arequest("GET", f"/sessions/{session_id}/refresh")
        return ClientSecret(**response_data)