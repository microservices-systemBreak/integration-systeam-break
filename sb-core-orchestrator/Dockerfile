FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files
COPY ["core.Api/core.Api.csproj", "core.Api/"]
COPY ["core.Application/core.Application.csproj", "core.Application/"]
COPY ["core.Domain/core.Domain.csproj", "core.Domain/"]
COPY ["core.Infrastructure/core.Infrastructure.csproj", "core.Infrastructure/"]

RUN dotnet restore "core.Api/core.Api.csproj"

# Copy everything else
COPY . .

WORKDIR "/src/core.Api"
RUN dotnet build "core.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "core.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "core.Api.dll"]