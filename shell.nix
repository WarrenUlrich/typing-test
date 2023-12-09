{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell rec {
  buildInputs = [
    pkgs.go
    pkgs.typescript
    pkgs.esbuild # for minifying js
  ];
}
