# ---------- BUILD ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Restore dependencies 
COPY *.csproj ./
RUN dotnet restore

# Copy the rest of the codes then publish
COPY . ./
RUN dotnet publish -o out

# ---------- RUNTIME ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENTRYPOINT ["dotnet", "InventoryManagementSystem.Api.dll"]