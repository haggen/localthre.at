import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../topBar";
import HistoryPanel from "../historyPanel";
import Welcome from "../welcome";
import ReportTable from "../reportTable";
import "resetize";
import "./global.css";

const storageKey = "app:data";

const Main = styled.main``;

const Content = styled.div`
  margin: 0 1.5rem 1.5rem;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      report: null,
      isHistoryPanelOpen: false
    };
  }

  toggleHistoryPanel(value) {
    this.setState(state => {
      return {
        isHistoryPanelOpen:
          value === undefined ? !state.isHistoryPanelOpen : value
      };
    });
  }

  setReport(report) {
    this.setState(state => ({ report }));
    if (!report) return;

    const history = [];
    for (let i = 0, l = this.state.history.length; i < l; i++) {
      if (this.state.history[i].id !== report.id) {
        history.push(this.state.history[i]);
      }
    }
    history.push(report);
    this.setState(state => ({ history }));
  }

  saveHistory(history) {
    localStorage.setItem(storageKey, JSON.stringify(history));
  }

  loadHistory() {
    const savedHistory = localStorage.getItem(storageKey);
    if (savedHistory) {
      this.setState({
        history: JSON.parse(savedHistory)
      });
    }
  }

  componentDidMount() {
    this.loadHistory();
  }

  componentDidUpdate() {
    if (this.state.history) {
      this.saveHistory(this.state.history);
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Main>
          <TopBar
            hasReport={!!this.state.report}
            toggleHistoryPanel={e => this.toggleHistoryPanel()}
          />
          <Content>
            <HistoryPanel
              history={this.state.history}
              isOpen={this.state.isHistoryPanelOpen}
              onRequestClose={() => this.toggleHistoryPanel(false)}
            />
            <Route
              exact
              path="/"
              render={props => (
                <Welcome {...props} resetReport={() => this.setReport(null)} />
              )}
            />
            <Route
              path="/:reportId"
              render={props => (
                <ReportTable
                  {...props}
                  reportId={props.match.params.reportId}
                  report={this.state.report}
                  onReportLoaded={report => this.setReport(report)}
                />
              )}
            />
          </Content>
        </Main>
      </BrowserRouter>
    );
  }
}

export default App;