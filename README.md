# QUALITY RELEASE WITH TERRAFORM PROJECT

Building a CI/CD pipeline with Azure DevOps.

### Status

[![Build Status](https://dev.azure.com/marcopaspuel/ensuring-quality-releases-azure-devops/_apis/build/status/marcoBrighterAI.ensuring-quality-releases-azure-devops?branchName=main)](https://dev.azure.com//ensuring-quality-releases-azure-devops/_build/latest?definitionId=9&branchName=main)

### Introduction

This project uses **Azure DevOps** to build a CI/CD pipeline that creates disposable test environments and runs a variety of
automated tests to ensure quality releases. It uses **Terraform** to deploy the infrastructure, **Azure App Services** to host
the web application and **Azure Pipelines** to provision, build, deploy and test the project. The automated tests run on a self-hosted
virtual machine (Linux) and consist of: **UI Tests** with selenium, **Integration Tests** with postman, **Stress Test** and **Endurance
Test** with jmeter. Additionally, it uses an **Azure Log Analytics** workspace to monitor and provide insight into the application's
behavior.

![pycharm0](images/ensuring_quality_releases_architecture.png)

### Prerequisites

- [Azure Account](https://portal.azure.com)
- [Azure Command Line Interface](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Azure DevOps Account](https://dev.azure.com/)

### Project Dependencies

- [Terraform](https://www.terraform.io/downloads.html)
- [JMeter](https://jmeter.apache.org/download_jmeter.cgi)
- [Postman](https://www.postman.com/downloads/)
- [Python](https://www.python.org/downloads/)
- [Selenium](https://sites.google.com/a/chromium.org/chromedriver/getting-started)

### Getting Started

1. Fork and clone this repository in your local environment
2. Open the project on your favorite text editor or IDE
3. Log into the [Azure Portal](https://portal.azure.com)
4. Log into [Azure DevOps](https://dev.azure.com/)

### Installation & Configuration

#### 1. Terraform in Azure

##### 1.1. Getting Azure Details

Log into your Azure account

``` bash
az login 
```

``` bash
az account set --subscription="SUBSCRIPTION_ID"
```

Create Service Principle

``` bash
az ad sp create-for-rbac --name ensuring-quality-releases-sp --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"
```

This command will output 5 values:

``` json
{
  "appId": "00000000-0000-0000-0000-000000000000",
  "displayName": "azure-cli-2017-06-05-10-41-15",
  "name": "http://azure-cli-2017-06-05-10-41-15",
  "password": "0000-0000-0000-0000-000000000000",
  "tenant": "00000000-0000-0000-0000-000000000000"
}
```

Create an `.azure_envs.sh` file inside the project directory and copy the content of the `.azure_envs.sh.template` to the newly created file.
Change the parameters based on the output of the previous command. These values map to the `.azure_envs.sh` variables like so:

    appId is the ARM_CLIENT_ID
    password is the ARM_CLIENT_SECRET
    tenant is the ARM_TENANT_ID

##### 1.2. Configure the storage account and state backend

To [configure the storage account](https://docs.microsoft.com/en-us/azure/developer/terraform/store-state-in-azure-storage)
run the bash script [config.sh](terraform/config.sh) thus:.

``` bash
./terraform/config.sh
```

This script will output 3 values:

``` bash
storage_account_name: tstate$RANDOM
container_name: tstate
access_key: 0000-0000-0000-0000-000000000000
```

Replace the `RESOURCE_GROUP_NAME` and `storage_account_name` in the [terraform/environments/test/main.tf](terraform/environments/test/main.tf)
file and the `access_key` in the `.azure_envs.sh` script.

```
terraform {
    backend "azurerm" {
        resource_group_name  = "RESOURCE_GROUP_NAME"
        storage_account_name = "_$RANDOM"
        container_name       = ""
        key                  = "terraform._"
    }
}
```

```
export ARM_ACCESS_KEY="access_key"
```

You will also need to replace this values in the [azure-pipelines.yaml](.devops/pipelines/azure-pipelines.yaml) file.

```
backendAzureRmResourceGroupName: "RESOURCE_GROUP_NAME"
backendAzureRmStorageAccountName: ''
backendAzureRmContainerName: ''
backendAzureRmKey: ''
```

#### 2. Self-hosted Test Runner and REST API Infrastructure

##### 2.1. Create an SSH key for authentication to a Linux VM in Azure

To generate a public private key pair run the following command (no need to provide a passphrase):

``` bash
cd ~/.ssh/
ssh-keygen -t rsa -b 4096
```

Ensure that the keys were created:

``` bash
ls -ll | grep id_rsa
```

For additional information of how to create and use SSH keys, click on the links bellow:

- [Create and manage SSH keys for authentication to a Linux VM in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/create-ssh-keys-detailed)
- [Creating and Using SSH Keys](https://serversforhackers.com/c/creating-and-using-ssh-keys)

##### 2.2. Deploy the REST API infrastructure from your local environment with Terraform

Run Terraform plan

``` bash
cd terraform/environments/test
```

``` bash
terraform init
```

``` bash
terraform plan -out solution.plan
```

After running the plan you should be able to see all the resources that will be created.

Run Terraform apply to deploy the infrastructure.

``` bash
terraform apply "solution.plan"
```

If everything runs correctly you should be able to see the resources been created. You can also check the creation of
the resources in the [Azure Portal](https://portal.azure.com/#blade/HubsExtension/BrowseResourceGroups) under <br/>
`Home > Resource groups > "RESOURCE_GROUP_NAME"`

#### 3. Azure DevOps

##### 3.1. Create a new Azure DevOps Project and Service Connections

- a) Go to [Azure DevOps](https://dev.azure.com/)
- b) Click on `New Project`
- c) Give the project a name, a description and click `Create`
- d) Create a new Service Connection `Project settings > Service connections > New service connection`
- e) Inside new service connection select `Azure Resource Manager > Service principal (automatic)`
- f) Select a Resource group, give the connection a name a description and click `Save`.
- g) Create service connections that matches the name provided in the [azure-pipelines.yaml](.devops/pipelines/azure-pipelines.yaml) file, examples are given below:.
```
e.g. at:
backendServiceArm: 'myserviceconnectionlink'
OR
azureSubscription: 'myserviceconnectionlink'
etc.
```

A detailed explanation on how to create a new Azure DevOps project and service connection can be found [here](https://www.youtube.com/watch?v=aIvl4NxCWwU&t=253s).

NOTE: Make sure that the webAppName matches the name provided in the `terraform.tfvars` file.

##### 3.2. Add the Self-hosted Test Runner to a Pipelines Environment

- a) Create a New Environment in Azure Pipelines. From inside your project in Azure DevOps go to:<br/>
`Pipelines > Environments > New environment`
- b) Give the environment a name e.g. `test`, then select `Virtual machines > Next`.
- c) From the dropdown select `Linux` and copy the `Registration script`
- d) From a local terminal connect to the Virtual Machine.
Use the ssh key created in step 2.1 of this guide. The public IP can be found in the Azure Portal under:

>      Home > Resource groups > "RESOURCE_GROUP_NAME" > "Virtual machine"

``` bash
ssh user@PublicIP
```

- e) Once you are logged into the VM paste the `Registration script` and run it.
- f) (optional) Add a tag when promoted.
##### 3.3. Upload the public SSH key and tfvars to Pipelines Library

- a) Add a secure file to Azure Pipelines. From inside your project in Azure DevOps go to:<br/>
`Pipelines > Library > Secure files > + Secure file`
- b) Add the **public ssh key** and the **terraform.tfvars** files to the secure files' library.
- c) Give the pipeline permissions to use the file:<br/>
`"SECURE_FILE_NAME" > Authorize for use in all pipelines`

##### 3.4. Create a new Azure Pipeline

- a) From inside your project in Azure DevOps go to:<br/>
`Pipelines > Pipelines > Create new pipeline`
- b) Select your project from GitHub
- c) Select `Existing Azure Pipelines YAML file`
- d) Select the `main` branch and select the path to the [azure-pipelines.yaml](.devops/pipelines/azure-pipelines.yaml) file.
- e) Select `Continue` and then `Run pipeline`
#### 4. Azure Monitor

##### 4.1. Create a new alert for the App Service

- a) From the [Azure Portal](https://portal.azure.com) go to:<br/>
`Home > Resource groups > "RESOURCE_GROUP_NAME" > "App Service Name" > Monitoring > Alerts`
- b) Click on `New alert rule`
- c) Double-check that you have the correct resource to make the alert for.
- d) Under `Condition` click `Add condition`
- d) Choose a condition e.g. `Http 404`
- e) Set the `Threshold value` to e.g. `1`. (You will get alerted after two consecutive HTTP 404 errors)
- f) Click `Done`

##### 4.2. Create a new action group for the App Service

- a) In the same page, go to the `Actions` section, click `Add action groups` and then `Create action group`
- b) Give the action group a name e.g. `http404`
- c) Add an **Action name** e.g. `HTTP 404` and choose `email` in **Action Type**.
- d) Provide your email and then click `OK`

##### 4.3. Add alert details

- a) In the same page, go to the `Alert rule details` section and add an `Alert rule name` e.g. `HTTP 404 greater than 1`
- b) Provide a description and select a -Severity`.
- c) Click `Create alter rule`

### Automated Testing Output
###### Completed CI/CD Pipeline

![pycharm1](images/Full_Azure_Pipeline.png )

Part of what was deployed in the CI/CD pipeline is the REST API and it is as shown in the `Deployed REST API`.
###### Deployed REST API

![pycharm2](images/fake_rest_api.png)

#### Test

##### UI Test

###### Output of running tests with Selenium on VM agent locally

![pycharm3](images/selenium_terminal_output.png)

##### Integration Tests

###### Selenium Integration Tests in the CI/CD pipeline

![pycharm4](images/Pipeline_Run_Successful1.png)

###### Different Runs

![pycharm5](images/Pipeline_Runs.png)

##### Stress and Endurance Tests

###### Outputs of JMeter Stress and Endurance Tests

![pycharm6](images/JMeter_Endurance_and_Stress_Test.png)

###### Outputs of JMeter Stress Test Summary

![pycharm7](images/stressTestResultOutputSummary.png)

###### Outputs of JMeter Endurance Test Summary

![pycharm8](images/EnduranceTestResultSummary.png)

### Monitoring & Observability

#### Error received that triggerd the Email alert

![pycharm9](images/Error404Page_Display.png)

#### Email received when the 404 alert was triggered

![pycharm10](images/404-Email_Alert.png)

### Helpful resources from Microsoft

These are all excellent official documentation examples from Microsoft that explain key components of CI/CD on Azure:

- [Design a CI/CD pipeline using Azure DevOps](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/apps/devops-dotnet-webapp)
- [Create a CI/CD pipeline for GitHub repo using Azure DevOps Starter](https://docs.microsoft.com/en-us/azure/devops-project/azure-devops-project-github)
- [Create a CI/CD pipeline for Python with Azure DevOps Starter](https://docs.microsoft.com/en-us/azure/devops-project/azure-devops-project-python?WT.mc_id=udacity_learn-wwl)
- [Continuous deployment to Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/deploy-continuous-deployment?tabs=github#option-1-use-app-service-kudu-build-server?WT.mc_id=udacity_learn-wwl)
- [Flask on Azure App Services](https://docs.microsoft.com/en-us/azure/app-service/quickstart-python?tabs=bash&WT.mc_id=udacity_learn-wwl&pivots=python-framework-flask)
- [Azure Pipelines for Python](https://docs.microsoft.com/en-us/azure/devops/pipelines/ecosystems/python?view=azure-devops&WT.mc_id=udacity_learn-wwl)


