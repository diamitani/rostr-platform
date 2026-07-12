# Contributing to ROSTR

Thanks for your interest in contributing to the billion-dollar agent operating system!

## How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/rostr.git
cd rostr
pip install -e ".[dev]"
```

### 2. Run Tests

```bash
pytest tests/ -v
```

### 3. Make Changes

- Follow existing code style
- Add tests for new functionality
- Update documentation

### 4. Submit PR

- Create a feature branch
- Push and open a pull request
- Ensure CI passes

## Code Style

- Type hints required for all public APIs
- Dataclasses for data objects
- Enums for constrained values

## Architecture Rules

1. PAL precedes execution — all agent invocations flow through PAL
2. Phase classification precedes allocation — NPAO navigates before allocating
3. RAG DAL gates all external knowledge retrieval
4. State updates persist to the reference hub
5. Cross-namespace access requires permission

## License

MIT — your contributions will be under the same license.
