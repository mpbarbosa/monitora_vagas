"""Test configuration module"""
from .selenium_config import (
    get_chrome_binary_path,
    get_chromedriver_path,
    get_chrome_options,
    create_chrome_driver,
    setup_chrome,
)

__all__ = [
    'get_chrome_binary_path',
    'get_chromedriver_path',
    'get_chrome_options',
    'create_chrome_driver',
    'setup_chrome',
]
