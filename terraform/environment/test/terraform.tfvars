# Azure subscription vars
subscription_id = "c761712a-772e-4832-b4d5-73b3a4b12e0b"
client_id = "c509c632-8f79-47cb-8f93-22ccf91e693a"
client_secret = "A_B8Q~sEOdplxM4IS4GJ_OKD4cRHGC4KDk_.tc.s"
tenant_id = "f958e84a-92b8-439f-a62d-4f45996b6d07"

# Resource Group/Location
location = "eastUS"
resource_group = "Azuredevops" # The same resource_group use to create the backend state and container
application_type = "qualityreleasewithterraform"

# Network
virtual_network_name = "qrwt_vnet"
address_space = ["10.5.0.0/16"]
address_prefix_test = "10.5.1.0/24"

# Tags
demo = "qualityreleasewithterraform"
