# Docker Containerized Testing Guide

**Status:** 🟢 **FUTURE IMPROVEMENT** (Low Priority)  
**Implementation:** Fix Recommendation #3  
**Effort:** 2-4 hours  
**Risk:** Low  
**Last Updated:** 2024-12-26

---

## Overview

Docker containerized testing provides a consistent, pre-configured Chrome/ChromeDriver environment that eliminates binary detection issues.

**Benefits:**
- ✅ Consistent environment across all machines
- ✅ No local Chrome/ChromeDriver installation needed
- ✅ Fixes binary detection issues
- ✅ VNC support (watch tests run live)
- ✅ Easy CI/CD integration
- ✅ Isolated test environment

---

## Files Created

### 1. Dockerfile (`tests/Dockerfile.selenium`)

**Purpose:** Multi-stage Docker build for Selenium tests

**Base Image:** `selenium/standalone-chrome:latest`
- Pre-configured Chrome browser
- Pre-installed ChromeDriver (matching version)
- Xvfb virtual display
- VNC server for viewing tests

**Features:**
- Python 3 environment
- Installs test dependencies
- Copies application files
- Health check endpoint
- Configurable via environment variables

### 2. Docker Compose (`docker-compose.test.yml`)

**Purpose:** Complete testing environment with services

**Services:**

1. **selenium-chrome** - Selenium Grid standalone
   - Port 4444: Selenium WebDriver endpoint
   - Port 7900: VNC server (view tests running)
   - Shared memory: 2GB (prevents Chrome crashes)

2. **test-runner** - Test execution container
   - Runs Python Selenium tests
   - Connects to selenium-chrome service
   - Volume-mounted source code
   - Screenshot output directory

3. **web-server** - HTTP server for application
   - Serves public/ directory
   - Port 8080
   - Python SimpleHTTPServer

**Networking:** Bridge network for service communication

### 3. Test Runner Script (`tests/run-docker-tests.sh`)

**Purpose:** Interactive menu for Docker testing

**Features:**
- Prerequisite checks (Docker, Docker Compose)
- Multiple execution modes
- VNC access instructions
- Cleanup utilities
- Color-coded output

---

## Usage

### Quick Start

```bash
# Run tests with Docker Compose (recommended)
./tests/run-docker-tests.sh
# Select option 1

# Or directly:
docker-compose -f docker-compose.test.yml up --build
```

### Build Dockerfile Only

```bash
# Build image
docker build -t monitora-vagas-selenium -f tests/Dockerfile.selenium .

# Run tests
docker run --rm monitora-vagas-selenium
```

### Watch Tests Run (VNC)

```bash
# Start services
docker-compose -f docker-compose.test.yml up

# Open VNC viewer in browser
http://localhost:7900

# Password: secret (or no password if configured)
```

**Live View:** See Chrome browser executing tests in real-time!

---

## Configuration

### Environment Variables

```yaml
# docker-compose.test.yml

environment:
  # Selenium configuration
  - SE_SCREEN_WIDTH=1920
  - SE_SCREEN_HEIGHT=1080
  - SE_VNC_NO_PASSWORD=1
  
  # Test configuration
  - SELENIUM_REMOTE_URL=http://selenium-chrome:4444/wd/hub
  - TEST_BASE_URL=http://web-server:8080
```

### Volume Mounts

```yaml
volumes:
  # Application files (read-only)
  - ../public:/app/public:ro
  - ../tests:/app/tests:ro
  - ../src:/app/src:ro
  
  # Test output (read-write)
  - ./test_screenshots:/app/tests/test_screenshots
```

---

## Test Execution

### Run All Tests

```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

**Behavior:**
- Builds images if needed
- Starts all services
- Runs tests
- Exits when tests complete
- Leaves containers running (for logs)

### Run Specific Test

```bash
docker-compose -f docker-compose.test.yml run test-runner \
    python3 tests/test-index-e2e.py
```

### Interactive Mode

```bash
docker-compose -f docker-compose.test.yml run test-runner bash

# Inside container:
python3 tests/simple_ui_test.py
python3 tests/test-index-e2e.py
pytest tests/
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/selenium-tests.yml

name: Selenium Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Selenium Tests
        run: |
          docker-compose -f docker-compose.test.yml up \
            --build \
            --abort-on-container-exit \
            --exit-code-from test-runner
      
      - name: Upload Screenshots
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-screenshots
          path: tests/test_screenshots/
```

### GitLab CI

```yaml
# .gitlab-ci.yml

selenium_tests:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
  artifacts:
    when: always
    paths:
      - tests/test_screenshots/
```

---

## Advantages

### vs. Local Testing

| Aspect | Local | Docker |
|--------|-------|--------|
| **Setup** | Complex (Chrome, ChromeDriver, versions) | Simple (`docker-compose up`) |
| **Consistency** | Varies by machine | Identical everywhere |
| **Binary Issues** | ❌ Common | ✅ Pre-configured |
| **CI/CD** | Difficult | Easy |
| **Isolation** | Shared system | Containerized |
| **Viewing Tests** | Headless only | ✅ VNC support |

### vs. Selenium Grid

| Aspect | Standalone | Grid |
|--------|-----------|------|
| **Complexity** | Low | Medium |
| **Parallel Tests** | No | Yes |
| **Resource Usage** | Light | Heavy |
| **Setup Time** | Fast | Slower |
| **Use Case** | Development | Production CI/CD |

---

## Troubleshooting

### Container Won't Start

**Issue:** Port already in use
```bash
# Check what's using port 4444
lsof -i :4444

# Stop conflicting service
docker-compose -f docker-compose.test.yml down
```

**Issue:** Permission denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Tests Fail to Connect

**Issue:** Service not ready
```bash
# Check service health
docker-compose -f docker-compose.test.yml ps

# View logs
docker-compose -f docker-compose.test.yml logs selenium-chrome
```

**Issue:** Network issues
```bash
# Recreate network
docker-compose -f docker-compose.test.yml down
docker network prune
docker-compose -f docker-compose.test.yml up
```

### VNC Not Working

**Issue:** Can't connect to port 7900
```bash
# Check if port is exposed
docker port monitora-vagas-selenium 7900

# Check firewall
sudo ufw allow 7900
```

### Chrome Crashes

**Issue:** Insufficient shared memory
```yaml
# Increase in docker-compose.test.yml
shm_size: '4g'  # Increase from 2g
```

---

## Cleanup

### Stop and Remove Containers

```bash
# Stop services
docker-compose -f docker-compose.test.yml down

# Remove volumes
docker-compose -f docker-compose.test.yml down -v

# Remove images
docker rmi monitora-vagas-selenium
docker rmi selenium/standalone-chrome:latest
```

### Clean Up Everything

```bash
# Run cleanup option
./tests/run-docker-tests.sh
# Select option 4

# Or manually:
docker system prune -a --volumes
```

---

## Performance

### Resource Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **RAM** | 2GB | 4GB |
| **CPU** | 2 cores | 4 cores |
| **Disk** | 2GB | 5GB |
| **Network** | Any | Fast (for image pulls) |

### Execution Time

- **First run:** ~5 minutes (download images)
- **Subsequent runs:** ~30 seconds (cached images)
- **Test execution:** Same as local (no overhead)

---

## Next Steps

### Implementation Checklist

- [ ] Install Docker and Docker Compose
- [ ] Test Dockerfile build
- [ ] Test Docker Compose setup
- [ ] Verify VNC access
- [ ] Run sample tests
- [ ] Integrate with CI/CD
- [ ] Document in team wiki
- [ ] Train team members

### Future Enhancements

- [ ] Parallel test execution (Selenium Grid)
- [ ] Multiple browser support (Firefox, Edge)
- [ ] Video recording of test runs
- [ ] Automatic screenshot comparison
- [ ] Test result reporting dashboard
- [ ] Integration with test management tools

---

## Related Documentation

- **[Selenium Configuration](../config/selenium_config.py)** - Local configuration
- **[Known Issues](../../KNOWN_ISSUES.md)** - Binary detection issue
- **[Test Scripts](../../docs/scripts/SCRIPTS_INDEX.md)** - All test scripts
- **[Docker Documentation](https://docs.docker.com/)** - Official Docker docs
- **[Selenium Docker](https://github.com/SeleniumHQ/docker-selenium)** - Official Selenium images

---

## Summary

Docker containerized testing provides a **future-proof solution** for Selenium test execution:

✅ **Eliminates binary detection issues**  
✅ **Consistent across all environments**  
✅ **Easy CI/CD integration**  
✅ **VNC support for debugging**  
✅ **Minimal setup required**

**Status:** Ready to implement when needed  
**Priority:** Low (current workarounds sufficient)  
**Recommendation:** Implement for CI/CD or team onboarding

---

**Created:** 2024-12-26  
**Last Updated:** 2024-12-26  
**Author:** Monitora Vagas Development Team
