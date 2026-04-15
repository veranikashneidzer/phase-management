# Task Description
Build a Phase Management Mini-App with CAP and SAP UI5 that allows a user to:
View a list of contracts(Table with dynamic create/change/delete of entries and sorting/filters)
Select a contract and view its phases(when you click on the contract it shows table of phases in popover where you can also create/change/delete phases)
See a simple cost summary as total in both tables
 
## General requirements:
	Good files and folders structure
	Unit test coverage for js functionality(jest preferred, but not mandatory)
	No linting, git or build setup is required, enough that app starts on local
	
 
## Base entities
Customer
├── ID: UUID (key)
├── Name: String (mandatory)
├── AccountNumber: String (unique)
└── contracts: Composition of many Contract
 
Contract
├── ID: UUID (key)
├── Description: String
├── StartDate: Date
├── EndDate: Date
├── Currency: String (default: 'EUR')
├── Status: String enum { Active; Inactive; Draft }
├── customer: Association to Customer
└── phases: Composition of many Phase
 
Phase
├── ID: UUID (key)
├── Name: String (mandatory)
├── StartDate: Date (mandatory)
├── EndDate: Date (mandatory)
├── MonthlyPrice: Decimal(15,2)
└── Description: String
 
*Extra points task for hardcore devs: Make Contract status an editable field(add settings button when we can add and delete possible statuses and change field status to drop-down)


# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.
