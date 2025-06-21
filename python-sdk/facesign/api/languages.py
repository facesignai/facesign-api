"""
Languages API implementation.
"""

from ..models.common import GetLangsResponse


class LanguagesAPI:
    """Languages API client."""
    
    def __init__(self, client):
        """Initialize with parent client."""
        self.client = client
    
    def get(self) -> GetLangsResponse:
        """
        Get all supported languages.
        
        Returns:
            GetLangsResponse with list of supported languages
            
        Example:
            >>> languages = client.languages.get()
            >>> for lang in languages.langs:
            ...     print(f"{lang.id}: {lang.title}")
        """
        response_data = self.client.request("GET", "/langs")
        # API returns array, but model expects object with 'langs' field
        return GetLangsResponse(langs=response_data)
    
    async def aget(self) -> GetLangsResponse:
        """Async version of get()."""
        response_data = await self.client.arequest("GET", "/langs")
        # API returns array, but model expects object with 'langs' field
        return GetLangsResponse(langs=response_data)
    
    # Alias for consistency with TypeScript SDK
    retrieve = get
    aretrieve = aget