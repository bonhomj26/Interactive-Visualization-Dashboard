// Building an interactive dashboard to explore the "Belly Button Biodiversity dataset"

// Use D3 library to read in samples.json

function buildMetadata(sample) {
    d3.json("/data/samples.json").then((data) => {
        var metadata = data.metadata;

        // Getting the object for the sample by filtering the data
        var sampleResultArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var sampleResult = sampleResultArray[0];
        console.log(sampleResult);

        // Select the panel with id by using D3

        var Panel = d3.select("#sample-metadata");

        // If previous contents of the panel existed, use html(" ") to clear any previously existing contents
        Panel.html("");

        // We need to add the key paired values to the panel and then append the new tags for each key pair value.
        // To do so, we will use object.entries

        Object.entries(sampleResult).forEach(([key, value]) => {
            Panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
            console.log(key, value);
        });
    });

}

// Create function to build charts

function buildCharts(sample) {

    // Getting the data from samples.json
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var sampleResultsArray = samples.filter(sampleObject => sampleObject.id == sample);
        var sampleResults = sampleResultsArray[0];
        console.log(sampleResults);

        // Getting the values for the bar chart using the sample_values data
        var sample_values = sampleResults.sample_values;

        // Setting the labels for the chart
        var otu_ids = sampleResults.otu_ids;

        // Setting the hobertext for the chart using the otu_labels
        var otu_labels = sampleResults.otu_labels;

        // Build the horizontal bar chart

        var barData = [{
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h" 

        }]; 

        var barLayout = {
            title: "Top 10 Bacteria Cultures ",
            margin: {t: 40, l:120}
        }

        Plotly.newPlot("bar", barData, barLayout);
        //  Top ten otu_ids ( in descending order)


        // Create a bubble chart

        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }

        }];

        var bubbleLayout = {
            margin: {t:0},
            hovermode: "closests",
            xaxis: {title: "OTU ID"}

        }


        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
}
//  Build Option change function
/* <select id="selDataset" onchange="optionChanged(this.value)"></select> */ 
function optionChanged(nextSample) {
    buildMetadata(nextSample);
    buildCharts(nextSample);


}




// Function for initialization

// Setting the init function

function init() {
    // Getting the reference for the dropdown selector in the "Test subject ID No"

    var selector = d3.select("#selDataset");

    //  Create the dropdown menu with all the samples_Ids
    d3.json("/data/samples.json").then((data) => {
        var sampleNames = data.names;
        console.log(sampleNames);

        // Append text for each sample using forEach
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });


        //  Create a variable for the first sample
        var firstSample = sampleNames[0];
        console.log(firstSample);
        buildMetadata(firstSample);
        buildCharts(firstSample);
    });
}

init();


    // @TODO: Complete the Following Function that Builds the Metadata Panel
