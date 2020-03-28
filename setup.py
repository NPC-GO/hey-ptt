from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="npc-class-hey-ptt",
    version="1.3",
    author="NPC-GO team.",
    author_email="npc.designer@gmail.com",
    description="NPC.GO Team 2020 web club class project",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/NPC-GO/hey-ptt",
    packages=find_packages(),
    platforms=["all"],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
