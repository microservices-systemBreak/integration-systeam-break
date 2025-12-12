FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files
COPY ["error.monitor.Api/error.monitor.Api.csproj", "error.monitor.Api/"]
COPY ["error.monitor.Domain/error.monitor.Domain.csproj", "error.monitor.Domain/"]
COPY ["error.monitor.Infrastructure/error.monitor.Infrastructure.csproj", "error.monitor.Infrastructure/"]

RUN dotnet restore "error.monitor.Api/error.monitor.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/error.monitor.Api"
RUN dotnet build "error.monitor.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "error.monitor.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "error.monitor.Api.dll"]