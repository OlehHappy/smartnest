#!/bin/bash
export NODE_PATH=$NODE_PATH:`pwd`/../../code/server/node_modules
node $@
