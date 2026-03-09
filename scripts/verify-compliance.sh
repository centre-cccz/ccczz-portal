#!/bin/bash

# 🔍 CCCZ RBAC System - Compliance Verification Script
# Usage: bash scripts/verify-compliance.sh

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║   🔍 CCCZ RBAC System - Compliance Verification                ║"
echo "║                                                                ║"
echo "║   Status: ✅ APPROVED CONDITIONAL (Feb 6, 2026)                ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    local file=$1
    local desc=$2
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $desc (missing: $file)"
        ((FAILED++))
    fi
}

# Function to check content
check_content() {
    local file=$1
    local pattern=$2
    local desc=$3
    if grep -q "$pattern" "$file" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $desc"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $desc"
        ((FAILED++))
    fi
}

echo "📋 INFRASTRUCTURE CHECKS"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Core library files
check_file "lib/types.ts" "lib/types.ts - Role/User types"
check_file "lib/rbac.ts" "lib/rbac.ts - RBAC helpers"
check_file "lib/jwt.ts" "lib/jwt.ts - JWT verification (C1 FIX)"
check_file "lib/withAuth.ts" "lib/withAuth.ts - Middleware wrapper"
check_file "lib/rbac.test.ts" "lib/rbac.test.ts - Test suite"

echo ""
echo "📁 API ROUTES"
echo "═════════════════════════════════════════════════════════════════"
echo ""

check_file "app/api/contact/route.ts" "app/api/contact/route.ts - Public endpoint"
check_file "app/api/events/route.ts" "app/api/events/route.ts - Events API"
check_file "app/api/tickets/route.ts" "app/api/tickets/route.ts - Tickets API (C2 FIX)"
check_file "app/api/reports/route.ts" "app/api/reports/route.ts - Reports API (C3 FIX)"

echo ""
echo "📚 DOCUMENTATION"
echo "═════════════════════════════════════════════════════════════════"
echo ""

check_file "docs/AUDIT_SIGNATURE.md" "docs/AUDIT_SIGNATURE.md - Executive summary"
check_file "docs/AUDIT_FINAL_SUMMARY.md" "docs/AUDIT_FINAL_SUMMARY.md - Detailed findings"
check_file "docs/AUDIT_RBAC_QA.md" "docs/AUDIT_RBAC_QA.md - QA Report"
check_file "docs/RBAC_COMPLIANCE.md" "docs/RBAC_COMPLIANCE.md - Deployment checklist"
check_file "docs/RBAC_USAGE.md" "docs/RBAC_USAGE.md - Developer guide"
check_file "docs/AUDIT_INDEX.md" "docs/AUDIT_INDEX.md - Navigation hub"
check_file "docs/AUDIT_ISSUES_TRACKER.md" "docs/AUDIT_ISSUES_TRACKER.md - Issues tracker"

echo ""
echo "🔐 SECURITY CHECKS"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Check JWT implementation
check_content "lib/rbac.ts" "Bearer" "JWT Bearer token support"
check_content "lib/jwt.ts" "verifyToken" "JWT verification function"
check_content "app/api/tickets/route.ts" "cannot access other direction revenue" "C2: Revenue direction validation"
check_content "app/api/reports/route.ts" "cannot export other direction reports" "C3: Reports direction validation"

echo ""
echo "🧪 TEST COVERAGE"
echo "═════════════════════════════════════════════════════════════════"
echo ""

check_content "lib/rbac.test.ts" "test_C1_jwtBearerToken" "C1: JWT Bearer token test"
check_content "lib/rbac.test.ts" "test_C2_revenueDirectionValidation" "C2: Revenue direction test"
check_content "lib/rbac.test.ts" "test_C3_reportsDirectionValidation" "C3: Reports direction test"
check_content "lib/rbac.test.ts" "test_validateDirectionFunction" "validateDirection() test"
check_content "lib/rbac.test.ts" "test_integrationScenarios" "Integration scenarios"

echo ""
echo "📋 RULE COMPLIANCE"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Rule 1: RBAC
check_content "lib/types.ts" "Role =" "Rule 1: Role type definition"
check_content "lib/types.ts" "User {" "Rule 1: User interface"

# Rule 2: Hierarchy
check_content "app/api/events/route.ts" "action=create" "Rule 2: Create events"
check_content "app/api/events/route.ts" "action=publish" "Rule 2: Publish events"

# Rule 3: Billeting
check_content "lib/withAuth.ts" "allowPublic" "Rule 3: Public access option"
check_content "app/api/tickets/route.ts" "price-change" "Rule 3: Price modification"

# Rule 4: Governance
check_content "app/api/events/route.ts" "created_by" "Rule 4: created_by tracking"
check_content "app/api/events/route.ts" "validated_by" "Rule 4: validated_by tracking"
check_content "app/api/events/route.ts" "appendHistory" "Rule 4: Audit history"

# Rule 5: Reporting
check_content "app/api/reports/route.ts" "ROLE_FINANCE" "Rule 5: Finance access"
check_content "app/api/reports/route.ts" "ROLE_DG" "Rule 5: DG access"

# Rule 6: API Security
check_content "lib/withAuth.ts" "withAuth" "Rule 6: Middleware wrapper"
check_content "lib/rbac.ts" "requireRole" "Rule 6: Role verification"

# Rule 7: Direction Isolation
check_content "lib/rbac.ts" "checkDirection" "Rule 7: Direction check"
check_content "lib/rbac.ts" "validateDirection" "Rule 7: Strict direction validation"

echo ""
echo "📊 SUMMARY"
echo "═════════════════════════════════════════════════════════════════"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo "Results: ${GREEN}$PASSED${NC} passed, ${RED}$FAILED${NC} failed"
echo "Score: ${GREEN}${PERCENTAGE}%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo ""
    echo "🎉 System ready for:"
    echo "   • Code review"
    echo "   • STAGING deployment"
    echo "   • Integration testing"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo ""
    echo "⚠️  Please review:"
    echo "   • Missing files"
    echo "   • Implementation gaps"
    echo "   • Documentation updates"
    echo ""
    exit 1
fi
