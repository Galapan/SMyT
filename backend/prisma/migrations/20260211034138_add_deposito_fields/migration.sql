-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPER_USUARIO', 'ADMINISTRADOR_SMYT', 'USUARIO_CONCESIONARIO');

-- CreateEnum
CREATE TYPE "EstatusLegal" AS ENUM ('ROBADO', 'DECOMISADO', 'OBSOLETO', 'SINIESTRADO');

-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('PARTICULAR', 'PUBLICO');

-- CreateEnum
CREATE TYPE "TipoTransmision" AS ENUM ('MANUAL', 'AUTOMATICA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "depositoId" TEXT,
    "creadoPorId" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depositos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "telefono" TEXT NOT NULL,
    "nombrePropietario" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "telefonoPropietario" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "depositos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "folioProceso" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "autoridad" TEXT NOT NULL,
    "documentosAdjuntos" TEXT[],
    "noInventario" TEXT NOT NULL,
    "marcaTipo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "tipoServicio" "TipoServicio" NOT NULL,
    "vin" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "noMotor" TEXT NOT NULL,
    "colorOriginal" TEXT NOT NULL,
    "colorActual" TEXT NOT NULL,
    "odometro" INTEGER NOT NULL,
    "estatusLegal" "EstatusLegal" NOT NULL,
    "tieneActaBaja" BOOLEAN NOT NULL DEFAULT false,
    "noOficio" TEXT,
    "fechaActaBaja" TIMESTAMP(3),
    "tieneTituloFactura" BOOLEAN NOT NULL DEFAULT false,
    "estadoCarroceria" TEXT,
    "estadoCristales" TEXT,
    "estadoEspejos" TEXT,
    "estadoLlantasDelanteras" TEXT,
    "estadoLlantasTraseras" TEXT,
    "motorCompleto" BOOLEAN,
    "bateriaPresente" BOOLEAN,
    "tipoTransmision" "TipoTransmision",
    "estadoAsientos" TEXT,
    "estadoCinturones" TEXT,
    "estadoVolanteTablero" TEXT,
    "estadoFrenos" TEXT,
    "aireAcondicionadoFunciona" BOOLEAN,
    "liquidosDrenados" BOOLEAN NOT NULL DEFAULT false,
    "estadoBolsasAire" TEXT,
    "observacionesInspector" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaSalida" TIMESTAMP(3),
    "justificacionBaja" TEXT,
    "documentoPdfUrl" TEXT,
    "depositoId" TEXT NOT NULL,
    "registradoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_folioProceso_key" ON "vehiculos"("folioProceso");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_noInventario_key" ON "vehiculos"("noInventario");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_vin_key" ON "vehiculos"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "depositos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_depositoId_fkey" FOREIGN KEY ("depositoId") REFERENCES "depositos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
