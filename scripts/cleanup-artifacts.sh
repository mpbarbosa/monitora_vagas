#!/bin/bash

# =============================================================================
# Artifact Cleanup Script
# =============================================================================
# Purpose: Remove untracked workflow artifacts and temporary documentation
# Usage: ./scripts/cleanup-artifacts.sh [--dry-run] [--interactive]
#
# This script removes files matching patterns in .gitignore that are currently
# untracked in the repository. It's useful for cleaning up after development
# sessions or before commits.
# =============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default options
DRY_RUN=false
INTERACTIVE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run|-d)
            DRY_RUN=true
            shift
            ;;
        --interactive|-i)
            INTERACTIVE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--dry-run] [--interactive]"
            echo ""
            echo "Options:"
            echo "  --dry-run, -d       Show what would be deleted without deleting"
            echo "  --interactive, -i   Ask for confirmation before each deletion"
            echo "  --help, -h          Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Header
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Workflow Artifact Cleanup Script${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e "${RED}Error: Not inside a git repository${NC}"
    exit 1
fi

# Get the repository root
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# Define artifact patterns (matches .gitignore patterns)
ARTIFACT_PATTERNS=(
    "*_SUMMARY.md"
    "*_SUMMARY.txt"
    "*_COMPLETE.md"
    "*_STATUS.md"
    "*_CHECKLIST.md"
    "*_INDEX.md"
    "*_REPORT.md"
    "*_ANALYSIS.md"
    "*_PLAN.md"
    "*_GUIDE.md"
    "*_REFERENCE.md"
    "ALL_ISSUES_FIXED_*.md"
    "AUDIT_*.md"
    "COMPLETE_ISSUE_*.md"
    "COMPREHENSIVE_*.md"
    "DOCUMENTATION_AUDIT_*.md"
    "DOCUMENTATION_FIXES_*.md"
    "DOCUMENTATION_ISSUES_*.md"
    "EXECUTIVE_SUMMARY_*.md"
    "FIXES_*.md"
    "FIXES_*.txt"
    "ISSUES_FIXED_*.md"
    "NEXT_STEPS_*.md"
    "PRIORITY_*.md"
    "README_ISSUE_*.md"
    "TEST_ANALYSIS_*.md"
    "TEST_FIXES_*.md"
    "TEST_GAP_*.md"
    "TEST_IMPROVEMENTS_*.md"
    "TEST_SUITE_*.md"
    "TODO_*.md"
    "UNIT_TESTS_*.md"
    "USE_CASE_*.txt"
    "ai_*.txt"
    "*_analysis.txt"
    "TEST_RESULTS.txt"
    "BROWSER_TESTING_*.txt"
    "check-*.sh"
    "fix-*.sh"
    "docker-compose.test.yml"
)

# Excluded files (keep these even if they match patterns)
EXCLUDED_FILES=(
    "README.md"
    "CHANGELOG.md"
    "KNOWN_ISSUES.md"
)

# Find untracked files matching patterns
FOUND_FILES=()

echo -e "${YELLOW}Scanning for workflow artifacts...${NC}"
echo ""

for pattern in "${ARTIFACT_PATTERNS[@]}"; do
    while IFS= read -r -d '' file; do
        # Get relative path
        rel_path=$(realpath --relative-to="$REPO_ROOT" "$file")
        
        # Skip if in docs/ or .github/ subdirectories
        if [[ "$rel_path" == docs/* ]] || [[ "$rel_path" == .github/* ]]; then
            continue
        fi
        
        # Skip excluded files
        skip=false
        for excluded in "${EXCLUDED_FILES[@]}"; do
            if [[ "$(basename "$file")" == "$excluded" ]]; then
                skip=true
                break
            fi
        done
        
        if ! $skip; then
            # Check if file is untracked
            if git ls-files --error-unmatch "$rel_path" > /dev/null 2>&1; then
                continue  # File is tracked, skip it
            fi
            
            FOUND_FILES+=("$rel_path")
        fi
    done < <(find "$REPO_ROOT" -maxdepth 1 -type f -name "$pattern" -print0 2>/dev/null)
done

# Remove duplicates and sort
if [ ${#FOUND_FILES[@]} -gt 0 ]; then
    IFS=$'\n' FOUND_FILES=($(sort -u <<<"${FOUND_FILES[*]}"))
    unset IFS
fi

# Display results
if [ ${#FOUND_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ No workflow artifacts found to clean up${NC}"
    exit 0
fi

echo -e "${YELLOW}Found ${#FOUND_FILES[@]} workflow artifact(s):${NC}"
echo ""

for file in "${FOUND_FILES[@]}"; do
    size=$(du -h "$file" 2>/dev/null | cut -f1)
    echo -e "  ${RED}✗${NC} $file ${BLUE}($size)${NC}"
done

echo ""

# Calculate total size
total_size=$(du -ch "${FOUND_FILES[@]}" 2>/dev/null | tail -n1 | cut -f1)
echo -e "${BLUE}Total size: $total_size${NC}"
echo ""

# Handle dry run
if $DRY_RUN; then
    echo -e "${YELLOW}[DRY RUN] No files were deleted${NC}"
    exit 0
fi

# Handle interactive mode
if $INTERACTIVE; then
    echo -e "${YELLOW}Delete these files? (y/N):${NC} "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Aborted by user${NC}"
        exit 0
    fi
fi

# Delete files
echo -e "${YELLOW}Deleting files...${NC}"
deleted_count=0

for file in "${FOUND_FILES[@]}"; do
    if rm "$file" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Deleted: $file"
        ((deleted_count++))
    else
        echo -e "  ${RED}✗${NC} Failed to delete: $file"
    fi
done

echo ""
echo -e "${GREEN}✓ Cleanup complete!${NC}"
echo -e "${GREEN}  Deleted: $deleted_count file(s)${NC}"
echo -e "${GREEN}  Freed: $total_size${NC}"
