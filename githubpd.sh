#!/bin/bash

cd /home/arch06/Ansible_portfolio

git pull
git add . 
git commit -m "arch commit $(date)"
git push origin -u main
