'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ShieldCheck, UserPlus, Loader2, Zap } from 'lucide-react';
import { registryABI } from '../constants/abi/registryAbi';
import { reputationABI } from '../constants/abi/reputationAbi';
import { validationABI } from '../constants/abi/validationAbi';
import {
  TREC_IDENTITY_REGISTRY_ADDRESS,
  TREC_REPUTATION_REGISTRY_ADDRESS,
  TREC_VALIDATION_REGISTRY_ADDRESS,
} from '../constants/addresses';

interface AgentRegistryProps {
  onAgentMinted?: () => void;
}

export default function AgentRegistry({ onAgentMinted }: AgentRegistryProps) {
  const [ensName, setEnsName] = useState('');
  const { address, isConnected } = useAccount();

  // 1. Hook to Mint the Agent NFT
  const { writeContractAsync, data: hash, isPending: isMinting } = useWriteContract();

  // 2. Wait for the transaction to actually hit the block
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 3. Get the agent's tokenId from the identity registry after minting
  const { data: tokenId } = useReadContract({
    address: TREC_IDENTITY_REGISTRY_ADDRESS,
    abi: registryABI,
    functionName: 'operatorToAgentId',
    args: [address as `0x${string}`],
    query: { enabled: isSuccess && !!address },
  });

  // 4. Read on-chain reputation from the reputation registry
  const { data: reputationData } = useReadContract({
    address: TREC_REPUTATION_REGISTRY_ADDRESS,
    abi: reputationABI,
    functionName: 'agentReputation',
    args: [tokenId as bigint],
    query: { enabled: isSuccess && tokenId !== undefined },
  });

  // 5. Read verification status from the validation registry
  const { data: isVerified } = useReadContract({
    address: TREC_VALIDATION_REGISTRY_ADDRESS,
    abi: validationABI,
    functionName: 'isAgentVerified',
    args: [tokenId as bigint],
    query: { enabled: isSuccess && tokenId !== undefined },
  });

  const handleRegister = async () => {
    if (!ensName) return;
    try {
      await writeContractAsync({
        address: TREC_IDENTITY_REGISTRY_ADDRESS,
        abi: registryABI,
        functionName: 'registerAgent',
        args: [ensName, ''],
        gas: BigInt(500000),
      });
      onAgentMinted?.();
    } catch {
      // User rejected or tx failed; don't redirect
    }
  };

  // STATE: Not Connected
  if (!isConnected) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-10 bg-[#050505] rounded-[2rem] border border-dashed border-white/5 backdrop-blur-sm">
        <p className="text-zinc-500 text-sm font-light">Connect your wallet to begin Agent Onboarding.</p>
      </div>
    );
  }

  // STATE: Success (The "Identity Card" view)
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto animate-in zoom-in-95 duration-700">
        <div className="relative p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Ambient Holographic Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div className="p-3 bg-zinc-900 rounded-2xl border border-white/5">
                <ShieldCheck className="text-zinc-200" size={24} strokeWidth={1.5} />
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-1">ERC-8004 Certified</p>
                <p className="text-[10px] text-zinc-700 font-mono tracking-tighter">HEX_ID: #0001</p>
              </div>
            </div>

            <h3 className="text-2xl font-medium text-white mb-1 tracking-tight">{ensName || "Anonymous Agent"}</h3>
            <p className="text-zinc-600 text-[11px] font-mono mb-10 tracking-wider">
              {address?.slice(0, 8)}...{address?.slice(-8)}
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
              <div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Reputation</p>
                <p className="text-xl font-medium text-white flex items-center gap-2">
                  {reputationData ? reputationData[0].toString() : '—'}
                  <Zap size={14} className="text-yellow-500/80 fill-yellow-500/20" />
                </p>
              </div>
              <div>
                <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-2">Verification</p>
                {isVerified ? (
                  <p className="text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    SECURE
                  </p>
                ) : (
                  <p className="text-zinc-500 text-xs font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                    PENDING
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-zinc-700 text-[10px] uppercase tracking-[0.15em] mt-6">
          Soulbound Identity • Non-Transferable
        </p>
      </div>
    );
  }

  // STATE: Default (Registration form)
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-medium text-zinc-500 ml-1 uppercase tracking-widest">
          Agent Identity Designation
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. elsa.eth"
            value={ensName}
            onChange={(e) => setEnsName(e.target.value)}
            disabled={isMinting || isConfirming}
            className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-zinc-800 focus:outline-none focus:border-white/20 transition-all font-light"
          />
        </div>
      </div>

      <button
        onClick={handleRegister}
        disabled={!ensName || isMinting || isConfirming}
        className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-2xl shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-30"
      >
        {isMinting || isConfirming ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span className="text-xs uppercase tracking-widest font-black">
              {isMinting ? "Authorizing..." : "Minting Identity..."}
            </span>
          </>
        ) : (
          <>
            <UserPlus size={18} />
            <span className="text-xs uppercase tracking-widest font-black">Establish Identity</span>
          </>
        )}
      </button>

      {hash && (
        <a
          href={`https://sepolia.basescan.org/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
        >
          View Telemetry on Basescan
        </a>
      )}
    </div>
  );
}