import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Onboarding.css";

const OnboardingStep = {
  Players: "Players",
  BoardSetup: "BoardSetup",
  Complete: "Complete",
};

// form for player setup
const PlayerSetup = ({ gameInfo, updateGameInfo }) => {
  return (
    <div className="Onboarding_players">
      <div>Who's playing?</div>
      <div className="Onboarding_inputRow">
        <input
          type="text"
          defaultValue={gameInfo.playerOneName}
          onBlur={(e) =>
            updateGameInfo({
              ...gameInfo,
              playerOneName: e.target.value,
              currentPlayer: e.target.value,
            })
          }
        />
        <input
          type="text"
          defaultValue={gameInfo.playerTwoName}
          onBlur={(e) =>
            updateGameInfo({
              ...gameInfo,
              playerTwoName: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

// form for board setup
const BoardSetup = ({ gameInfo, updateGameInfo }) => {
  return (
    <div className="Onboarding_board">
      <div>Board dimensions</div>
      <div>
        <div className="Onboarding_inputRow">
          <input
            type="number"
            defaultValue={gameInfo.columnCount}
            onBlur={(e) =>
              updateGameInfo({
                ...gameInfo,
                columnCount: Number(e.target.value),
              })
            }
          />
          <div className="Onbaording_board_x">x</div>
          <input
            type="number"
            defaultValue={gameInfo.rowCount}
            onBlur={(e) =>
              updateGameInfo({
                ...gameInfo,
                rowCount: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      <div>How many in a row to win?</div>
      <div className="Onboarding_inputRow">
        <input
          type="number"
          defaultValue={gameInfo.winNumber}
          onBlur={(e) =>
            updateGameInfo({
              ...gameInfo,
              winNumber: Number(e.target.value),
            })
          }
        />
      </div>
    </div>
  );
};

// Component that handles onboarding
export class Onboarding extends Component {
  /* ~~~~~~~~~~~~~~~~
    Setup
    ~~~~~~~~~~~~~~~~~ */
  constructor(props) {
    super(props);
    this.state = {
      currentStep: OnboardingStep.Players,
    };
  }

  /* ~~~~~~~~~~~~~~~~
    Updating Current Step
    ~~~~~~~~~~~~~~~~~ */
  setStep = (newCurrentStep) => {
    if (newCurrentStep === OnboardingStep.Complete) {
      this.props.playGame();
    }

    this.setState({ currentStep: newCurrentStep });
  };

  reset = () => {
    if (window.confirm("Are you sure? This will erase your game.")) {
      this.setState({ currentStep: OnboardingStep.Players });
      this.props.resetGame();
    }
  };

  /* ~~~~~~~~~~~~~~~~
    Rendering
    ~~~~~~~~~~~~~~~~~ */
  renderCurrentStep = () => {
    const { currentStep } = this.state;
    const { gameInfo, updateGameInfo } = this.props;

    switch (currentStep) {
      case OnboardingStep.Players:
        return (
          <PlayerSetup gameInfo={gameInfo} updateGameInfo={updateGameInfo} />
        );
      case OnboardingStep.BoardSetup:
        return (
          <BoardSetup gameInfo={gameInfo} updateGameInfo={updateGameInfo} />
        );
      case OnboardingStep.Complete:
      default:
        return (
          <div>
            Setup Complete, have fun! (
            <a onClick={this.reset} className="Onboarding_resetLink">
              reset
            </a>
            )
          </div>
        );
    }
  };

  renderButtons = () => {
    const { currentStep } = this.state;
    let prevStep = null;
    let nextStep = null;
    let nextStepText = "Next";

    switch (currentStep) {
      case OnboardingStep.Players:
        nextStep = OnboardingStep.BoardSetup;
        break;
      case OnboardingStep.BoardSetup:
        prevStep = OnboardingStep.Players;
        nextStep = OnboardingStep.Complete;
        nextStepText = "Done";
        break;
      case OnboardingStep.Complete:
      default:
        break;
    }

    return (
      <div className="Onboarding_buttons">
        {!!prevStep && (
          <button onClick={() => this.setStep(prevStep)}>Back</button>
        )}
        {!!nextStep && (
          <button onClick={() => this.setStep(nextStep)}>{nextStepText}</button>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="Onboarding">
        <label className="Onboarding_label">Game Setup</label>
        {this.renderCurrentStep()}
        {this.renderButtons()}
      </div>
    );
  }
}

Onboarding.propTypes = {
  updateGameInfo: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
  playGame: PropTypes.func.isRequired,
  gameInfo: PropTypes.shape({
    playerOneName: PropTypes.string,
    playerTwoName: PropTypes.string,
    columnCount: PropTypes.number,
    rowCount: PropTypes.number,
    winNumber: PropTypes.number,
  }).isRequired,
};
