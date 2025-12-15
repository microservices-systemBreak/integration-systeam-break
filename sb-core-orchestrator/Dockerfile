FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files
# Copy csproj files
COPY ["sb-core-orchestrator/core.Api/core.Api.csproj", "sb-core-orchestrator/core.Api/"]
COPY ["sb-core-orchestrator/core.Application/core.Application.csproj", "sb-core-orchestrator/core.Application/"]
COPY ["sb-core-orchestrator/core.Domain/core.Domain.csproj", "sb-core-orchestrator/core.Domain/"]
COPY ["sb-core-orchestrator/core.Infrastructure/core.Infrastructure.csproj", "sb-core-orchestrator/core.Infrastructure/"]
COPY ["sb.Shared/sb.Shared.csproj", "sb.Shared/"]

RUN dotnet restore "sb-core-orchestrator/core.Api/core.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/sb-core-orchestrator/core.Api"
RUN dotnet build "core.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "core.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "core.Api.dll"]