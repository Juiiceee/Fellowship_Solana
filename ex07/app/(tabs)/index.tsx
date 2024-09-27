// Polyfills at the top
import "text-encoding-polyfill";
import "react-native-get-random-values";
import { Buffer } from "buffer";
global.Buffer = Buffer;
 
import { clusterApiUrl } from "@solana/web3.js";
import { ConnectionProvider } from "@/components/ConnectionProvider";
import { AuthorizationProvider } from "@/components/AuthProvider";
import { ProgramProvider } from "@/components/ProgramProvider";
import { MainScreen } from "@/components/MainScreen"; // Going to make this
import React from "react";
 
export default function App() {
  const cluster = "devnet";
  const endpoint = clusterApiUrl(cluster);
 
  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "processed" }}
    >
      <AuthorizationProvider cluster={cluster}>
        <ProgramProvider>
          <MainScreen />
        </ProgramProvider>
      </AuthorizationProvider>
    </ConnectionProvider>
  );
}

