/*
  Warnings:

  - A unique constraint covering the columns `[airline]` on the table `flights` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "flights_airline_key" ON "flights"("airline");