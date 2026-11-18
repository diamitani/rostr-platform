"""Setup for ROSTR Core — non-setuptools fallback."""
from setuptools import setup, find_packages

setup(
    name="rostr-core",
    version="1.0.1",
    description="ROSTR: PAL intent compiler, NPAO orchestration, RAG DAL and Hub for multi-agent systems",
    author="Patrick Diamitani",
    author_email="patrick@diamitani.com",
    license="MIT",
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    python_requires=">=3.10",
    install_requires=["pyyaml>=6.0"],
)
