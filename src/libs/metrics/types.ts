export enum ButtonsActionEventType {
  // Main Screen
  MainScreenStakeButtonClicked = 'Staking-MainScreen-StakeButton-Clicked',
  MainScreenBuyButtonClicked = 'Staking-MainScreen-BuyButton-Clicked',
  MainScreenConnectButtonClicked = 'Staking-MainScreen-ConnectButton-Clicked',
  MainScreenDisconnectButtonClicked = 'Staking-MainScreen-DisconnectButton-Clicked',
  // Staking Screen
  StakingScreenMaxButtonClicked = 'Staking-StakingScreen-MaxButton-Clicked',
  StakingScreenContinueButtonClicked = 'Staking-StakingScreen-ContinueButton-Clicked',
  StakingScreenBackButtonClicked = 'Staking-StakingScreen-BackButton-Clicked',
  // Staking confirm Screen
  StakingConfirmScreenStakeButtonClicked = 'Staking-StakingConfirmScreen-StakeButton-Clicked',
  StakingConfirmScreenBackButtonClicked = 'Staking-StakingConfirmScreen-BackButton-Clicked',
  StakingConfirmScreenErrorBackButtonClicked = 'Staking-StakingConfirmScreen-ErrorBackButton-Clicked',
  StakingConfirmScreenDoneButtonClicked = 'Staking-StakingConfirmScreen-DoneButton-Clicked',
  StakingConfirmScreenDetailsButtonClicked = 'Staking-StakingConfirmScreen-DetailsButton-Clicked',
  // Portfolio Screen
  PortfolioScreenStakeMoreButtonClicked = 'Staking-PortfolioScreen-StakeMoreButton-Clicked',
  PortfolioScreenUnstakeButtonButtoClicked = 'Staking-PortfolioScreen-UnstakeButton-Clicked',
  PortfolioScreenWithdrawButtonClicked = 'Staking-PortfolioScreen-WithdrawButton-Clicked',
  PortfolioScreenViewInExploreButtonClicked = 'Staking-PortfolioScreen-ViewInExploreButton-Clicked',
  // Unstake Screen
  UnstakeScreenUnstakeButtonClicked = 'Staking-UnstakeScreen-UnstakeButton-Clicked',
  UnstakeScreenBackButtonClicked = 'Staking-UnstakeScreen-BackButton-Clicked',
  UnstakeScreenErrorBackButtonClicked = 'Staking-UnstakeScreen-ErrorBackButton-Clicked',
  UnstakeScreenDoneButtonClicked = 'Staking-UnstakeScreen-DoneButton-Clicked',
  UnstakeScreenDetailsButtonClicked = 'Staking-UnstakeScreen-DetailsButton-Clicked',
  // Withdraw Screen
  WithdrawScreenWithdrawButtonClicked = 'Staking-WithdrawScreen-WithdrawButton-Clicked',
  WithdrawScreenBackButtonClicked = 'Staking-WithdrawScreen-BackButton-Clicked',
  WithdrawScreenErrorBackButtonClicked = 'Staking-WithdrawScreen-ErrorBackButton-Clicked',
  WithdrawScreenDoneButtonClicked = 'Staking-WithdrawScreen-DoneButton-Clicked',
  WithdrawScreenDetailsButtonClicked = 'Staking-WithdrawScreen-DetailsButton-Clicked',
}

export enum ScreenEventType {
  MainScreenShown = 'Staking-MainScreen-Shown',
  StackingScreenShown = 'Staking-StackingScreen-Shown',
  StackingConfirmScreenShown = 'Staking-StackingConfirmScreen-Shown',
  StackingProcessScreenShown = 'Staking-StackingProcessScreen-Shown',
  StackingErrorScreenShown = 'Staking-StackingErrorScreen-Shown',
  StackingDoneScreenShown = 'Staking-StackingDoneScreen-Shown',
  PortfolioScreenShown = 'Staking-PortfolioScreen-Shown',
  UnstakeScreenShown = 'Staking-UnstakeScreen-Shown',
  UnstakeProcessScreenShown = 'Staking-UnstakeProcessScreen-Shown',
  UnstakeErrorScreenShown = 'Staking-UnstakeErrorScreen-Shown',
  UnstakeDoneScreenShown = 'Staking-UnstakeDoneScreen-Shown',
  WithdrawScreenShown = 'Staking-WithdrawScreen-Shown',
  WithdrawProcessScreenShown = 'Staking-WithdrawProcessScreen-Shown',
  WithdrawErrorScreenShown = 'Staking-WithdrawErrorScreen-Shown',
  WithdrawDoneScreenShown = 'Staking-WithdrawDoneScreen-Shown',
}