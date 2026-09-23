# IMS E2E Environment

Phase 3 uses a disposable environment. The E2E stack must never point at the production database.

## Local startup

Set only an E2E test password in your shell. The other credentials below are local-only values and can be generated for each session.

```bash
export E2E_TEST_PASSWORD='set-locally'
export E2E_DB_NAME='ims_e2e'
export E2E_DB_USER='ims_e2e'
export E2E_DB_PASSWORD="$(openssl rand -hex 16)"
export E2E_DB_ROOT_PASSWORD="$(openssl rand -hex 16)"
export E2E_JWT_SECRET="$(openssl rand -hex 32)"
export E2E_RESEND_API_KEY='e2e-disabled'
export E2E_RESEND_FROM_EMAIL='no-reply@e2e.invalid'

docker compose -f compose.e2e.yml up -d --build
```

The API is exposed on `http://127.0.0.1:8080`. The mutation Playwright configuration starts Vite on `http://127.0.0.1:4173` and uses the normal `/api` proxy.

Run the environment smoke test from `client`:

```bash
pnpm run e2e:mutation
```

## Cleanup

```bash
docker compose -f compose.e2e.yml down -v
```

MySQL uses tmpfs for its data directory, and the Compose shutdown removes the remaining resources.

## Seeded identities

When the E2E seed is enabled, the API creates:

- `FIRST_ADMIN + ALL`
- `SECOND_ADMIN + ALL`
- `EMPLOYEE + NONE`

EIDs can be overridden with `E2E_FIRST_ADMIN_EID`, `E2E_SECOND_ADMIN_EID`, and `E2E_EMPLOYEE_EID`.

The seed password is supplied only through `E2E_TEST_PASSWORD`. No E2E password is stored in the repository.

## Phase 3 boundaries

This configuration establishes the disposable environment and seeded authentication identities. It does not yet create business records, mutate inventory, send real email, or verify database invariants. Those are the next Phase 3 mutation/verification tasks.
