# Inventory Management System

## Run the app

- Open PowerShell then navigate to the backend project folder (where the .csproj file is located)
- Check the installed .NET SDK version (dotnet --version). If the required version is not installed, download and install the appropriate .NET SDK
- Run the API: dotnet run
- Open the frontend project folder in Visual Studio Code and install dependencies: npm install
- Start the development server: npm run dev
- Open the displayed local URL (e.g., http://localhost:5173) in your browser
- Click the login button in the running app

## Overview

The Inventory Management System is designed for tracking, purchase management, and order processing. This application features a .NET Web API backend and a React frontend, providing a user-friendly interface.

### Wireframe:

![Inventory_Management_System7](https://github.com/user-attachments/assets/8af752d8-ea8a-43a4-9cc3-a38a73739cd0)
(login and search are not implemented)

## Features

### Product Management

- Add new products to the system and manage them
- View all products in the inventory

### Inventory Overview

- Display a list of all products
- Calculate and show the total value of inventory

### Purchase Tracking

- View all purchases, including total cost and status
- Visualize purchase history through interactive diagrams
- Track and manage incoming purchases for receiving or returns

### Order Management

- View and manage all customer orders
- Process order shipments or cancellations

### Technical Stack

- Backend: .NET Web API
- Frontend: React
- Database: SQL Server

## User stories:

- As a system user, I want to log in to the system, so that I can securely access its features based on my permissions.
- As an inventory manager, I want to add a product to the system, so that it can be tracked and used later for purchases, sales, or production.
- As an inventory manager, I want to see all products in the system, so that I can review stock items when purchasing, using them in another product, or selling them.
- As a business owner, I want to view the inventory overview including total stock value, so that I can understand the financial value of the stored products.
- As a purchasing manager, I want to see all purchases with their total cost and status, so that I can track spending and monitor order progress.
- As a business owner, I want to visualize purchase costs over time in a chart, so that I can analyze spending trends and make better financial decisions.
- As a warehouse employee, I want to see incoming purchases, so that I can receive or return them properly.
- As a sales manager, I want to see all orders, so that I can send or cancel them when necessary.
