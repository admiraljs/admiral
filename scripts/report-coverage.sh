#!/bin/bash

bash <(curl -s https://codecov.io/bash) -s packages/admiral -c -F admiral
bash <(curl -s https://codecov.io/bash) -s packages/admiral-integration-mocha -c -F admiral_integration_mocha
bash <(curl -s https://codecov.io/bash) -s packages/admiral-target-local -c -F admiral_target_local
bash <(curl -s https://codecov.io/bash) -s packages/admiral-unit-mocha -c -F admiral_unit_mocha
