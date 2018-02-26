'use strict';
/**
 * Create Flight Transaction
 * @param {org.jb.airline.CreateFlight} flightData
 * @transaction
 */
function createFlight(flightData) {
    /**
     * Validating schedule data
     * I the date is past date then throw an error
     */
    var timeNow = new Date().getTime();
    var scheduleTime = new Date(flightData.schedule).getTime();
    if(scheduleTime < timeNow) {
        throw new Error("Scheduled time cannot be in the past time!");
    }

    return getAssetRegistry('org.jb.airline.flight.Flight')
        .then(function(flightRegistry){
            var factory = getFactory();
            
            // Storing namespace in a variable
            var NS = 'org.jb.aireline.flight';
            var flightId = generateFlightId(flightData.flightNumber, flightData.schedule);

            //Create Flight asset
            var flight = factory.newResource(NS, 'Flight', flightId);
            flight.flightNumber = flightData.flightNumber;
            flight.aliasFlightNumber = [];

            // Creating concept for route
            var route = factory.newConcept(NS, 'Route');
            route.origin = flightData.origin;
            route.destination = flightData.destination;
            route.schedule = flightData.schedule;

            // Set route to Flight asset
            flight.route = route;

            // Emit the event FlightCreated
            event = factory.newEvent(NS, 'FlightCreated');
            event.flightId = flightId;
            emit(event);

            // Add to registry
            return flightRegistry.add(flight);
        })
}

/**
 * Create flightId from flightNumber and schedule 
 */
function generateFlightId(flightNumber, schedule) {
    var date = new Date(schedule);
    
    var dayNum = date.getDate();
    if((dayNum+'').length==1) dayNum = '0'+dayNum;

    var month = date.getMonth()+'1';
    if((month+'').length==1) month = '0'+month;
    
    var year = (date.getFullYear()+'').substring(2,4);

    return flightNumber+'-'+dayNum+'-'+month+'-'+year;
}