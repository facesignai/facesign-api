"""
Avatars API implementation.
"""

from ..models.common import GetAvatarsResponse


class AvatarsAPI:
    """Avatars API client."""
    
    def __init__(self, client):
        """Initialize with parent client.""" 
        self.client = client
    
    def get(self) -> GetAvatarsResponse:
        """
        Get all available avatars.
        
        Returns:
            GetAvatarsResponse with list of available avatars
            
        Example:
            >>> avatars = client.avatars.get()
            >>> for avatar in avatars.avatars:
            ...     print(f"{avatar.id}: {avatar.name} ({avatar.gender})")
        """
        response_data = self.client.request("GET", "/avatars")
        # API returns array, but model expects object with 'avatars' field
        return GetAvatarsResponse(avatars=response_data)
    
    async def aget(self) -> GetAvatarsResponse:
        """Async version of get()."""
        response_data = await self.client.arequest("GET", "/avatars")
        # API returns array, but model expects object with 'avatars' field
        return GetAvatarsResponse(avatars=response_data)
    
    # Alias for consistency with TypeScript SDK
    retrieve = get
    aretrieve = aget