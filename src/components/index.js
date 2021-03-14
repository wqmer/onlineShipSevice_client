import Table from "./Table"
import ProcessingPage from './ProcessingPage'
import React, { Component, PropTypes } from 'react'

const componentMapName = (name, props = undefined) => {
    switch (name) {
        case "table":
            return (<Table {...props} />)
        case "processing_page":
            return (<ProcessingPage {...props} />)
        default:
            return undefined
    }
}

export default componentMapName
