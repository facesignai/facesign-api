#!/usr/bin/env python3
import os, json, time, pathlib, re
import requests

ROOT = pathlib.Path.cwd()
SCENARIOS_DIR = ROOT / 'scripts' / 'scenarios'
FIXTURES_DIR = ROOT / 'scripts' / 'fixtures' / 'api-py'


def load_env():
    base_url = os.environ.get('FACESIGN_DEV_API_URL', 'https://api.dev.facesign.ai')
    api_key = os.environ.get('FACESIGN_DEV_API_KEY', '')
    if not api_key:
        # Try .env.local then .env
        for fname in ['.env.local', '.env']:
            p = ROOT / fname
            if p.exists():
                text = p.read_text()
                m = re.search(r'^\s*FACESIGN_DEV_API_KEY\s*=\s*(.+)\s*$', text, re.M)
                if m:
                    api_key = m.group(1).strip().strip('"\'')
                    break
    return base_url, api_key


def write_fixture(parts, request_obj=None, response_obj=None, meta_obj=None):
    d = FIXTURES_DIR.joinpath(*parts)
    d.mkdir(parents=True, exist_ok=True)
    if request_obj is not None:
        (d / 'request.json').write_text(json.dumps(request_obj, indent=2) + '\n')
    if response_obj is not None:
        (d / 'response.json').write_text(json.dumps(response_obj, indent=2) + '\n')
    if meta_obj is not None:
        (d / 'meta.json').write_text(json.dumps(meta_obj, indent=2) + '\n')


def op_to_req(op, params):
    if op == 'createSession':
        return {'method': 'POST', 'path': '/sessions', 'body': params}
    if op == 'getSession':
        return {'method': 'GET', 'path': f"/sessions/{params['sessionId']}"}
    if op == 'createClientSecret':
        return {'method': 'GET', 'path': f"/sessions/{params['sessionId']}/refresh"}
    if op == 'listSessions':
        limit = params.get('limit', 5)
        return {'method': 'GET', 'path': f"/sessions?limit={limit}"}
    if op == 'getLangs':
        return {'method': 'GET', 'path': '/langs'}
    if op == 'getAvatars':
        return {'method': 'GET', 'path': '/avatars'}
    raise ValueError(f'Unknown operation: {op}')


def get_by_path(obj, dotted):
    cur = obj
    for key in dotted.split('.'):
        if isinstance(cur, dict) and key in cur:
            cur = cur[key]
        else:
            return None
    return cur


def substitute_vars(payload, vars_map):
    s = json.dumps(payload)
    def repl(m):
        key = m.group(1)
        return str(vars_map.get(key, m.group(0)))
    s = re.sub(r'\$\{([^}]+)\}', repl, s)
    try:
        return json.loads(s)
    except Exception:
        return payload


def run_scenario(file_path, base_url, api_key):
    scenario = json.loads(pathlib.Path(file_path).read_text())
    name = pathlib.Path(file_path).stem
    vars_map = dict(scenario.get('vars') or {})

    for idx, step in enumerate(scenario['steps'], start=1):
        op = step['operation']
        params = substitute_vars(step.get('params') or {}, vars_map)
        req = op_to_req(op, params)

        url = f"{base_url}{req['path']}"
        headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}
        started = time.time()
        r = requests.request(req['method'], url, headers=headers, json=req.get('body'))
        elapsed = int((time.time() - started) * 1000)
        try:
            body = r.json()
        except Exception:
            body = r.text

        parts = [name, f"{idx:02d}_{op}"]
        write_fixture(parts,
                      request_obj={'op': op, 'req': req, 'params': params},
                      response_obj={'status': r.status_code, 'headers': dict(r.headers), 'body': body},
                      meta_obj={'status': r.status_code, 'duration_ms': elapsed, 'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())})

        exp_status = (step.get('expects') or {}).get('status')
        if exp_status and r.status_code != exp_status:
            raise RuntimeError(f"Step {idx} expected status {exp_status} got {r.status_code}")

        if 'save' in step and isinstance(step['save'], dict):
            for k, dotted in step['save'].items():
                val = get_by_path({'body': body, 'status': r.status_code, 'headers': dict(r.headers)}, dotted)
                if val is not None:
                    vars_map[k] = val


def main():
    base_url, api_key = load_env()
    if not api_key:
        raise SystemExit('FACESIGN_DEV_API_KEY is required (env or .env/.env.local)')
    scenario = os.environ.get('SCENARIO', 'liveness-and-document.json')
    file_path = SCENARIOS_DIR / scenario
    if not file_path.exists():
        raise SystemExit(f'Scenario not found: {file_path}')
    run_scenario(str(file_path), base_url, api_key)
    print('Done')


if __name__ == '__main__':
    main()



