"""Setup for ROSTR Core — non-setuptools fallback."""
from setuptools import setup, find_packages

setup(
    name="rostr-core",
    version="1.0.0",
    description="ROSTR: Billion-Dollar Agent Operating System",
    author="Patrick Diamitani",
    author_email="patrick@diamitani.com",
    license="MIT",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.10",
    install_requires=["pyyaml>=6.0"],
)
