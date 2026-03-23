import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function fetchWalletTransactions(address: string) {
  const url = `https://base-sepolia.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((tx: Record<string, unknown>) => ({
      hash: tx.hash,
      block: tx.block,
      timestamp: tx.timestamp,
      from: (tx.from as Record<string, string>)?.hash,
      to: (tx.to as Record<string, string>)?.hash,
      value: tx.value,
      gas_used: tx.gas_used,
      status: tx.status,
      method: tx.method,
    }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { ensName, operatorWallet, tokenId } = await req.json();

    if (!operatorWallet) {
      return NextResponse.json({ error: 'operatorWallet is required' }, { status: 400 });
    }

    ensureDataDir();

    // Build agent.json
    const agentData = {
      agent_name: ensName || 'TRECC_Demo_Agent_01',
      operator_wallet: operatorWallet,
      erc_8004_identity: tokenId ? tokenId.toString() : '1',
      supported_tools: [
        'Base Sepolia RPC',
        'GitHub API',
        '1inch Router',
      ],
      compute_constraints: {
        max_api_calls_per_task: 50,
        max_token_usage: 100000,
      },
      task_categories: [
        'DeFi Execution',
        'On-chain Verification',
        'Data Gathering',
      ],
    };

    fs.writeFileSync(
      path.join(DATA_DIR, 'agent.json'),
      JSON.stringify(agentData, null, 2),
      'utf-8'
    );

    // Build agent_log.json from on-chain activity
    const transactions = await fetchWalletTransactions(operatorWallet);
    const agentLog = {
      operator_wallet: operatorWallet,
      fetched_at: new Date().toISOString(),
      transaction_count: transactions.length,
      transactions,
    };

    fs.writeFileSync(
      path.join(DATA_DIR, 'agent_log.json'),
      JSON.stringify(agentLog, null, 2),
      'utf-8'
    );

    return NextResponse.json({ success: true, agent: agentData, log_count: transactions.length });
  } catch (err) {
    console.error('Agent register route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
