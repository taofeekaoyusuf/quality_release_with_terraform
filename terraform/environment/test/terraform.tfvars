# Azure subscription vars
subscription_id = "456cc604-544c-45f8-99d0-c1b73aeec440"
client_id = "3f3465f2-ee69-48cd-8a44-60b7798f1adc"
client_secret = "ndz8Q~mkPs~wjteC0knuBxqfJQ4iLwNgKQLQLc~W"
tenant_id = "f958e84a-92b8-439f-a62d-4f45996b6d07"

# Resource Group/Location
location = "eastUS"
resource_group = "Azuredevops" # The same resource_group use to create the backend state and container
application_type = "qualityreleasewithterraform"

# Network
virtual_network_name = "qrp_vnet"
address_space = ["10.5.0.0/16"]
address_prefix_test = "10.5.1.0/24"

# Tags
demo = "qualityreleasewithterraform"
