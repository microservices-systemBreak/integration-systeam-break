FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files
# Copy csproj files
COPY ["sb-error-monitor/error.Api/error.Api.csproj", "sb-error-monitor/error.Api/"]
COPY ["sb-error-monitor/error.Domain/error.Domain.csproj", "sb-error-monitor/error.Domain/"]
COPY ["sb-error-monitor/error.Infrastructure/error.Infrastructure.csproj", "sb-error-monitor/error.Infrastructure/"]
COPY ["sb-error-monitor/error.Application/error.Application.csproj", "sb-error-monitor/error.Application/"]
COPY ["sb.Shared/sb.Shared.csproj", "sb.Shared/"]

RUN dotnet restore "sb-error-monitor/error.Api/error.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/sb-error-monitor/error.Api"
RUN dotnet build "error.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "error.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "error.Api.dll"]