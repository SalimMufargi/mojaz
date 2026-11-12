# Security Specification — Mojaz Field Visits Platform

## 1. Data Invariants
1. **Valid Document IDs**: Every document ID (`staffId`, `visitId`) must match `^[a-zA-Z0-9_\-]+$` and be at most 64 characters.
2. **Strict Schema Enforcement**: Every write to `/staff/{staffId}` and `/visits/{visitId}` must contain all required keys and only allowed keys (`hasAll` + `hasOnly`), preventing shadow/ghost field injection.
3. **Volumetric Bounds**: Every string field has strict `.size()` bounds matching `firebase-blueprint.json` (e.g., `notes <= 1500`, `name <= 150`), and rubric scores must be numbers within valid ranges (`1 <= score <= 5`, `0 <= overallScore <= 100`).
4. **Department & Status Enum Validation**: `dept` must be one of the two official Educational Evaluation departments; `status` must be one of `['مستقرة', 'عاجلة', 'قيد المتابعة']`.

## 2. The "Dirty Dozen" Payloads
1. **Shadow Field Injection on Staff**: `{ id: "1686553", name: "Test", dept: "قسم تقويم تعلم مواد العلوم التطبيقية", role: "رئيس قسم", specialty: "إدارة", targetVisits: 20, isAdmin: true }` -> Rejected by `hasOnly()`.
2. **Oversized String DoS on Visit Notes**: `{ ..., notes: "A".repeat(5000) }` -> Rejected by `notes.size() <= 1500`.
3. **Invalid ID Poisoning**: Document path `/visits/invalid id with spaces!` -> Rejected by `isValidId(visitId)`.
4. **Invalid Department Enum**: `{ ..., dept: "قسم غير موجود" }` -> Rejected by `dept in [...]`.
5. **Invalid Visit Status Enum**: `{ ..., status: "ملغاة" }` -> Rejected by `status in ['مستقرة', 'عاجلة', 'قيد المتابعة']`.
6. **Out-of-Range Rubric Score**: `{ ..., domainPlanning: 99 }` -> Rejected by `domainPlanning >= 1 && domainPlanning <= 5`.
7. **Missing Required Field on Visit Create**: Payload missing `teacher` or `school` -> Rejected by `hasAll()`.
8. **Type Confusion on Target Visits**: `{ ..., targetVisits: "25" }` -> Rejected by `targetVisits is number`.
9. **Immutable ID Mutation on Update**: Updating `visit.id` to a different value -> Rejected by `incoming().id == existing().id`.
10. **Negative Overall Score**: `{ ..., overallScore: -10 }` -> Rejected by `overallScore >= 0 && overallScore <= 100`.
11. **Empty Teacher or School Name**: `{ ..., school: "", teacher: "" }` -> Rejected by `size() >= 2`.
12. **Unlisted Collection Access**: Writing to `/unauthorized_collection/doc1` -> Rejected by global default-deny catch-all.
