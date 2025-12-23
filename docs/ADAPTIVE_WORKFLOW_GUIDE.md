# 🔧 Adaptive Workflow Optimization Guide

**Project**: monitora_vagas  
**Configuration Version**: 2.3.1+  
**Last Updated**: 2025-12-23

## Overview

This guide explains the adaptive workflow optimization configuration that has been applied to the **monitora_vagas** project. These settings enable intelligent, performance-optimized workflow execution with up to **90% time savings** for documentation-only changes.

## 🎯 Key Features Enabled

### 1. **Smart Execution** (40-85% faster)
- Automatically skips unnecessary steps based on change detection
- Analyzes git diff to determine impacted areas
- Validates skip conditions before each step

### 2. **Parallel Execution** (33% faster)
- Runs independent steps simultaneously
- Configurable parallel groups
- Maximum 3 concurrent steps by default

### 3. **AI Response Caching** (60-80% token reduction)
- 24-hour cache TTL for AI responses
- SHA256-based cache keys
- Automatic cache cleanup

### 4. **Checkpoint Resume**
- Automatic continuation from last completed step
- Use `--no-resume` to force fresh start

## 📋 Configuration Structure

The `.workflow-config.yaml` file is organized into four main sections:

### Section 1: Project Identification
```yaml
project:
  name: "monitora_vagas"
  type: "client-spa"
  kind: "client_spa"
```

### Section 2: Tech Stack
```yaml
tech_stack:
  primary_language: "javascript"
  build_system: "npm"
  test_framework: "jest"
  test_command: "npm test"
  lint_command: "npm run lint"
```

### Section 3: Adaptive Steps Configuration
```yaml
adaptive_steps:
  skip_conditions:
    - step: "dependency_validation"
      when: "no_dependency_changes && recent_validation_passed"
    
    - step: "full_test_suite"
      when: "only_doc_changes"
    
    - step: "code_quality"
      when: "no_code_changes"
  
  parallel_groups:
    - name: "validation_group"
      steps: ["lint", "dependency_check", "markdown_lint"]
    
    - name: "test_group"
      steps: ["test", "coverage_analysis"]
    
    - name: "documentation_group"
      steps: ["doc_generation", "summary_creation", "consistency_check"]
```

### Section 4: Performance Optimization
```yaml
optimization:
  enable_ai_cache: true
  ai_cache_ttl: 86400  # 24 hours
  enable_smart_execution: true
  enable_parallel_execution: true
  max_parallel_steps: 3
```

## 🚀 Usage Examples

### Recommended: Full Optimization (Production)
```bash
cd /home/mpb/Documents/GitHub/monitora_vagas

# Run with all optimizations enabled
/path/to/ai_workflow/src/workflow/execute_tests_docs_workflow.sh \
  --target . \
  --smart-execution \
  --parallel \
  --auto
```

### Documentation-Only Changes (90% faster)
```bash
# When you've only modified markdown files
./execute_tests_docs_workflow.sh \
  --target . \
  --smart-execution \
  --auto
```

### Force Fresh Start
```bash
# Ignore checkpoints and run from Step 0
./execute_tests_docs_workflow.sh \
  --target . \
  --no-resume \
  --smart-execution \
  --parallel
```

### Selective Step Execution
```bash
# Run only specific steps
./execute_tests_docs_workflow.sh \
  --target . \
  --steps 0,1,12
```

### Dry Run (Preview Execution Plan)
```bash
# See what would run without executing
./execute_tests_docs_workflow.sh \
  --target . \
  --dry-run \
  --smart-execution \
  --parallel
```

## 📊 Performance Impact

### Expected Time Savings by Change Type

| Change Type | Baseline | With Optimizations | Time Saved |
|-------------|----------|-------------------|------------|
| **Documentation Only** | 23 min | 2.3 min | **90%** ⚡ |
| **Code Changes** | 23 min | 10 min | **57%** |
| **Config Changes** | 23 min | 14 min | **40%** |
| **Full Changes** | 23 min | 15.5 min | **33%** |

### AI Cache Impact
- **First Run**: Normal token usage
- **Subsequent Runs**: 60-80% reduction in AI tokens
- **Cache Duration**: 24 hours (configurable)

## 🔍 Skip Conditions Explained

### 1. Dependency Validation Skip
```yaml
- step: "dependency_validation"
  when: "no_dependency_changes && recent_validation_passed"
```
**Triggers when:**
- `package.json` unchanged
- `package-lock.json` unchanged
- Last validation passed successfully

### 2. Full Test Suite Skip
```yaml
- step: "full_test_suite"
  when: "only_doc_changes"
```
**Triggers when:**
- Only `.md` files changed
- No changes in `src/` or `tests/`
- No configuration file changes

### 3. Code Quality Skip
```yaml
- step: "code_quality"
  when: "no_code_changes"
```
**Triggers when:**
- No changes in `src/` directory
- No JavaScript/TypeScript file changes

## 🔄 Parallel Execution Groups

### Validation Group (Runs Simultaneously)
- ✅ Markdown linting
- ✅ Dependency checking
- ✅ ESLint validation

### Test Group (Runs Simultaneously)
- ✅ Jest test execution
- ✅ Coverage analysis

### Documentation Group (Runs Simultaneously)
- ✅ AI documentation generation
- ✅ Consistency validation
- ✅ Summary creation

## ⚙️ Step-Specific Configuration

### Documentation Analysis (Step 1)
```yaml
step_01_documentation:
  ai_persona: "documentation_specialist"
  max_output_lines: 500
  timeout: 300  # 5 minutes
```

### Test Execution (Step 7)
```yaml
step_07_test_exec:
  test_command: "npm test"
  timeout: 300
  continue_on_failure: false
```

### Code Quality (Step 9)
```yaml
step_09_code_quality:
  lint_command: "npm run lint"
  max_warnings: 10
  fail_on_error: true
```

## 🛠️ Customization Guide

### Adjusting Cache TTL
```yaml
optimization:
  ai_cache_ttl: 43200  # 12 hours instead of 24
```

### Changing Parallel Execution Limit
```yaml
optimization:
  max_parallel_steps: 5  # Run up to 5 steps simultaneously
```

### Modifying Test Coverage Threshold
```yaml
test_optimization:
  coverage_threshold: 90  # Require 90% coverage
```

### Adding Custom Skip Conditions
```yaml
adaptive_steps:
  skip_conditions:
    - step: "custom_validation"
      when: "no_api_changes"
      description: "Skip API validation if backend code unchanged"
```

## 📈 Monitoring and Metrics

### Viewing Execution Metrics
```bash
# Metrics are automatically collected in:
.ai_workflow/metrics/current_run.json     # Latest execution
.ai_workflow/metrics/history.jsonl        # Historical data
```

### Checking AI Cache Performance
```bash
# Cache statistics stored in:
.ai_workflow/.ai_cache/index.json

# View cache hit rate:
cat .ai_workflow/.ai_cache/index.json | jq '.stats'
```

### Reviewing Execution Logs
```bash
# Latest workflow log:
ls -lt .ai_workflow/logs/workflow_*/workflow_execution.log | head -1
```

## 🎓 Best Practices

### 1. **Development Workflow**
```bash
# Quick iterations during development
./execute_workflow.sh --smart-execution --steps 1,7,9
```

### 2. **Pre-Commit Hook**
```bash
# Validate changes before commit
./execute_workflow.sh --smart-execution --dry-run
```

### 3. **CI/CD Integration**
```bash
# Full validation in CI pipeline
./execute_workflow.sh --smart-execution --parallel --auto --no-resume
```

### 4. **Documentation Updates**
```bash
# Fast documentation-only workflow
./execute_workflow.sh --smart-execution --steps 1,2,12
```

## 🔧 Troubleshooting

### Cache Issues
```bash
# Clear AI cache if responses seem stale
rm -rf .ai_workflow/.ai_cache/
```

### Checkpoint Problems
```bash
# Force fresh start ignoring checkpoints
./execute_workflow.sh --no-resume
```

### Parallel Execution Conflicts
```yaml
# Reduce parallel steps if experiencing issues
optimization:
  max_parallel_steps: 2
```

### Skip Condition Not Working
```bash
# Run with verbose output to debug
./execute_workflow.sh --smart-execution --show-graph
```

## 📚 Additional Resources

- **Main Workflow Documentation**: `/path/to/ai_workflow/docs/workflow-automation/`
- **Configuration Reference**: `/path/to/ai_workflow/docs/TARGET_PROJECT_FEATURE.md`
- **Performance Guide**: `/path/to/ai_workflow/docs/workflow-automation/PHASE2_COMPLETION.md`
- **Version History**: `/path/to/ai_workflow/docs/workflow-automation/WORKFLOW_AUTOMATION_VERSION_EVOLUTION.md`

## 📞 Support

For issues or questions:
1. Check execution logs in `.ai_workflow/logs/`
2. Review configuration in `.workflow-config.yaml`
3. Run health check: `./src/workflow/lib/health_check.sh`
4. Consult comprehensive documentation in workflow automation docs

---

**Configuration Applied**: 2025-12-23 02:20:11  
**Workflow Version**: v2.3.1+  
**Project**: monitora_vagas (JavaScript/Node.js SPA)
