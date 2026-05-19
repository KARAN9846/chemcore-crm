import { Component } from "react";

class OnboardingErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ONBOARDING ROUTE RENDER ERROR:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "24px" }}>
          Something went wrong while rendering onboarding. Check the console for
          details.
        </div>
      );
    }

    return this.props.children;
  }
}

export default OnboardingErrorBoundary;
