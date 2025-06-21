"""
Utility functions for FaceSign SDK.
"""

from typing import Dict, List, TypeVar, Union, Any


T = TypeVar('T')


def pick(base: Dict[str, Any], keys: List[str]) -> Dict[str, Any]:
    """
    Extract specific keys from a dictionary.
    
    Similar to TypeScript's pick utility - creates a new dictionary
    containing only the specified keys from the source dictionary.
    
    Args:
        base: Source dictionary to pick from
        keys: List of keys to extract
        
    Returns:
        New dictionary with only the specified keys
        
    Example:
        >>> data = {"name": "John", "age": 30, "city": "NYC"}
        >>> pick(data, ["name", "age"])
        {"name": "John", "age": 30}
    """
    return {key: base.get(key) for key in keys if key in base}