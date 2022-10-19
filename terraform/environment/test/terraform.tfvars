# Azure subscription vars
subscription_id = "47bf7713-533e-4f12-98d2-dcd63866167c"
client_id       = "6c639815-f2c8-41c7-8765-9fa7fb8a7785"
client_secret   = "fPi8Q~jhVjQPdivE6KkB.7PiOleMBDuEnww_Dcy~"
tenant_id       = "f958e84a-92b8-439f-a62d-4f45996b6d07"

# Resource Group/Location
location         = "East US"
resource_group   = "Azuredevops" # The same resource_group use to create the backend state and container
application_type = "qualityreleasewithterraform"

# Network
virtual_network_name = "qrwt_vnet"
address_space        = ["10.5.0.0/16"]
address_prefix_test  = "10.5.1.0/24"

# Tags
demo = "qualityreleasewithterraform"
